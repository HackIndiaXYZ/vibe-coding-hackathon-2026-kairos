from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.models import User, EmailIdentity, PhoneIdentity, PlatformAccount, RiskFinding

router = APIRouter(prefix="/graph", tags=["Graph"])

CATEGORY_COLORS = {
    "social":         "#6366f1",
    "finance":        "#f59e0b",
    "dev":            "#10b981",
    "shopping":       "#3b82f6",
    "email":          "#8b5cf6",
    "entertainment":  "#ec4899",
    "productivity":   "#14b8a6",
    "other":          "#9ca3af",
}

RISK_COLORS = {
    "low":    "#22c55e",
    "medium": "#f59e0b",
    "high":   "#ef4444",
}


@router.get("/")
def graph_data(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    emails   = db.query(EmailIdentity).filter(EmailIdentity.user_id == current_user.id).all()
    phones   = db.query(PhoneIdentity).filter(PhoneIdentity.user_id == current_user.id).all()
    accounts = db.query(PlatformAccount).filter(PlatformAccount.user_id == current_user.id).all()
    findings = db.query(RiskFinding).filter(RiskFinding.user_id == current_user.id).all()

    nodes = []
    edges = []

    # Central user node
    nodes.append({
        "id": "user",
        "label": current_user.full_name,
        "type": "user",
        "color": "#6366f1",
        "size": 30,
    })

    # Email nodes
    for e in emails:
        nid = f"email_{e.id}"
        nodes.append({"id": nid, "label": e.email, "type": "email", "color": "#8b5cf6", "size": 18})
        edges.append({"from": "user", "to": nid, "label": "email"})

    # Phone nodes
    for p in phones:
        nid = f"phone_{p.id}"
        nodes.append({"id": nid, "label": p.phone_number, "type": "phone", "color": "#14b8a6", "size": 16})
        edges.append({"from": "user", "to": nid, "label": "phone"})

    # Account nodes — connected to user
    for a in accounts:
        nid = f"account_{a.id}"
        color = CATEGORY_COLORS.get(a.category, "#9ca3af")
        nodes.append({
            "id": nid,
            "label": a.platform_name,
            "type": "account",
            "category": a.category,
            "risk_level": a.risk_level,
            "color": color,
            "border_color": RISK_COLORS.get(a.risk_level, "#9ca3af"),
            "size": 14,
        })
        edges.append({"from": "user", "to": nid, "label": a.category})

    # Risk findings as separate nodes linked to user
    for f in findings:
        nid = f"risk_{f.id}"
        nodes.append({
            "id": nid,
            "label": f.title,
            "type": "risk",
            "severity": f.severity,
            "color": RISK_COLORS.get(f.severity, "#9ca3af"),
            "size": 12,
        })
        edges.append({"from": "user", "to": nid, "label": "risk"})

    return {
        "nodes": nodes,
        "edges": edges,
        "stats": {
            "total_nodes": len(nodes),
            "total_edges": len(edges),
            "accounts_by_category": _group_by(accounts, "category"),
        }
    }


def _group_by(items, attr):
    result = {}
    for item in items:
        key = getattr(item, attr, "other")
        result[key] = result.get(key, 0) + 1
    return result