from fastapi import APIRouter, Depends, HTTPException
from fastapi.responses import RedirectResponse
from fastapi import Query
import requests
import os

from sqlalchemy.orm import Session
from app.db.database import get_db
from app.models.models import User, EmailIdentity, PlatformAccount
from app.core.security import create_access_token
from app.core.config import settings
from app.services.gmail_scanner import get_gmail_messages, get_message_details, extract_sender_from_headers
from app.services.domain_discovery import extract_domain, enrich_domain, assess_domain_risk
from app.services.risk_engine import analyze_and_save_risks

router = APIRouter(prefix="/auth/google", tags=["Google OAuth"])

REDIRECT_URI = "http://localhost:8001/auth/google/callback"


@router.get("/login")
def google_login():
    scope = (
        "openid email profile "
        "https://www.googleapis.com/auth/gmail.readonly"
    )
    url = (
        "https://accounts.google.com/o/oauth2/v2/auth"
        f"?client_id={settings.GOOGLE_CLIENT_ID}"
        f"&redirect_uri={REDIRECT_URI}"
        "&response_type=code"
        f"&scope={scope}"
        "&access_type=offline"
        "&prompt=consent"
    )
    return RedirectResponse(url)


@router.get("/callback")
def google_callback(code: str = Query(...), db: Session = Depends(get_db)):

    # ── 1. Exchange code for tokens ──────────────────────────────────────────
    token_resp = requests.post(
        "https://oauth2.googleapis.com/token",
        data={
            "code": code,
            "client_id": settings.GOOGLE_CLIENT_ID,
            "client_secret": settings.GOOGLE_CLIENT_SECRET,
            "redirect_uri": REDIRECT_URI,
            "grant_type": "authorization_code",
        }
    )
    token_data = token_resp.json()

    if "error" in token_data:
        raise HTTPException(status_code=400, detail=f"OAuth error: {token_data['error']}")

    access_token = token_data["access_token"]

    # ── 2. Get Google user info ──────────────────────────────────────────────
    user_info = requests.get(
        "https://www.googleapis.com/oauth2/v1/userinfo",
        headers={"Authorization": f"Bearer {access_token}"}
    ).json()

    google_id = user_info.get("id")
    email = user_info.get("email")
    name = user_info.get("name", email)
    avatar = user_info.get("picture")

    # ── 3. Upsert user in DB ─────────────────────────────────────────────────
    user = db.query(User).filter(User.email == email).first()
    if not user:
        user = User(
            full_name=name,
            email=email,
            google_id=google_id,
            avatar_url=avatar,
            password_hash="",  # OAuth user, no password
        )
        db.add(user)
        db.commit()
        db.refresh(user)
    else:
        # Update avatar/name in case they changed
        user.google_id = google_id
        user.avatar_url = avatar
        db.commit()

    # ── 4. Save primary email identity ──────────────────────────────────────
    existing_email = db.query(EmailIdentity).filter(
        EmailIdentity.user_id == user.id,
        EmailIdentity.email == email
    ).first()
    if not existing_email:
        db.add(EmailIdentity(email=email, is_primary=True, user_id=user.id))
        db.commit()

    # ── 5. Scan Gmail and discover domains ───────────────────────────────────
    messages_data = get_gmail_messages(access_token, max_results=500)
    messages = messages_data.get("messages", [])

    print(f"[Gmail] Scanning {len(messages)} messages for user {email}")

    discovered_domains: set[str] = set()

    for msg in messages:
        try:
            details = get_message_details(access_token, msg["id"])
            headers = details.get("payload", {}).get("headers", [])
            sender = extract_sender_from_headers(headers)
            domain = extract_domain(sender)
            if domain:
                discovered_domains.add(domain)
        except Exception as e:
            print(f"[Gmail] Error processing message {msg['id']}: {e}")
            continue

    print(f"[Gmail] Discovered {len(discovered_domains)} unique domains")

    # ── 6. Save discovered accounts to DB (skip duplicates) ─────────────────
    existing_domains = {
        a.domain for a in db.query(PlatformAccount)
        .filter(PlatformAccount.user_id == user.id).all()
    }

    new_count = 0
    for domain in discovered_domains:
        if domain in existing_domains:
            continue
        enriched = enrich_domain(domain)
        risk_level = assess_domain_risk(domain, enriched["category"])
        account = PlatformAccount(
            domain=domain,
            platform_name=enriched["platform_name"],
            category=enriched["category"],
            risk_level=risk_level,
            has_2fa=False,
            username="",
            user_id=user.id,
        )
        db.add(account)
        new_count += 1

    db.commit()
    print(f"[DB] Saved {new_count} new accounts for user {user.id}")

    # ── 7. Run risk engine ───────────────────────────────────────────────────
    findings = analyze_and_save_risks(user.id, db)
    from app.services.risk_engine import calculate_risk_score
    risk_score = calculate_risk_score(findings)

    # ── 8. Issue JWT and redirect to frontend ────────────────────────────────
    jwt_token = create_access_token({"sub": str(user.id)})

    frontend_url = (
        f"{settings.FRONTEND_URL}/auth/callback"
        f"?token={jwt_token}"
        f"&name={name}"
        f"&email={email}"
        f"&risk_score={risk_score}"
        f"&accounts_found={len(discovered_domains)}"
    )
    return RedirectResponse(frontend_url)