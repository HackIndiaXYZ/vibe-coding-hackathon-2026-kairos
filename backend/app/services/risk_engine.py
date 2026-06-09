from app.models.models import PlatformAccount, RiskFinding
from sqlalchemy.orm import Session

# Severity weights for score calculation
SEVERITY_WEIGHTS = {
    "critical": 25,
    "high":     15,
    "medium":    7,
    "low":       2,
}

def analyze_and_save_risks(user_id: int, db: Session) -> list[RiskFinding]:
    """
    Run risk analysis for a user's accounts and persist findings.
    Clears old findings first so re-runs are idempotent.
    """
    # Clear old findings
    db.query(RiskFinding).filter(RiskFinding.user_id == user_id).delete()

    accounts = db.query(PlatformAccount).filter(PlatformAccount.user_id == user_id).all()
    findings = []

    total = len(accounts)
    finance_accounts = [a for a in accounts if a.category == "finance"]
    no_2fa = [a for a in accounts if not a.has_2fa]
    high_risk = [a for a in accounts if a.risk_level == "high"]
    unknown = [a for a in accounts if a.category == "other"]

    # Rule 1: Too many accounts = large attack surface
    if total > 30:
        findings.append(_finding(user_id, "Large digital footprint", 
            f"You have {total} discovered accounts. A large number of linked services increases your attack surface.",
            "high", "exposure"))
    elif total > 15:
        findings.append(_finding(user_id, "Moderate digital footprint",
            f"You have {total} discovered accounts. Consider reviewing and deleting unused ones.",
            "medium", "exposure"))

    # Rule 2: No 2FA on finance accounts
    finance_no_2fa = [a for a in finance_accounts if not a.has_2fa]
    if finance_no_2fa:
        names = ", ".join(a.platform_name for a in finance_no_2fa[:3])
        findings.append(_finding(user_id, "Financial accounts without 2FA",
            f"{names} — financial platforms without two-factor authentication are high-risk targets.",
            "critical", "authentication"))

    # Rule 3: Many accounts without 2FA
    if len(no_2fa) > 10:
        findings.append(_finding(user_id, "Most accounts lack 2FA",
            f"{len(no_2fa)} of your accounts have no two-factor authentication enabled.",
            "high", "authentication"))
    elif len(no_2fa) > 5:
        findings.append(_finding(user_id, "Several accounts lack 2FA",
            f"{len(no_2fa)} accounts have no two-factor authentication.",
            "medium", "authentication"))

    # Rule 4: High risk domains detected
    if high_risk:
        names = ", ".join(a.platform_name for a in high_risk[:3])
        findings.append(_finding(user_id, "High-risk accounts detected",
            f"Accounts flagged as high risk: {names}. These may be temporary or suspicious services.",
            "high", "suspicious"))

    # Rule 5: Many unknown/uncategorized services
    if len(unknown) > 10:
        findings.append(_finding(user_id, "Many unrecognized services",
            f"{len(unknown)} unrecognized domains found in your email history. Some may be unused or forgotten accounts.",
            "medium", "exposure"))

    # Rule 6: No finance accounts (informational — maybe fine)
    # Skipped as not really a risk

    # Persist
    for f in findings:
        db.add(f)
    db.commit()
    for f in findings:
        db.refresh(f)

    return findings


def calculate_risk_score(findings: list) -> int:
    """
    Score from 0 (terrible) to 100 (great).
    Starts at 100, deducted by findings severity.
    """
    deduction = sum(SEVERITY_WEIGHTS.get(f.severity, 0) for f in findings)
    score = max(0, 100 - deduction)
    return score


def _finding(user_id, title, description, severity, category):
    return RiskFinding(
        user_id=user_id,
        title=title,
        description=description,
        severity=severity,
        category=category,
    )