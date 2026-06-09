from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.models import User, RiskFinding, PlatformAccount
from app.services.risk_engine import analyze_and_save_risks, calculate_risk_score

router = APIRouter(prefix="/risks", tags=["Risks"])


@router.get("/")
def get_risks(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    findings = (
        db.query(RiskFinding)
        .filter(RiskFinding.user_id == current_user.id)
        .order_by(RiskFinding.severity)
        .all()
    )
    severity_order = {"critical": 0, "high": 1, "medium": 2, "low": 3}
    findings_sorted = sorted(findings, key=lambda f: severity_order.get(f.severity, 4))
    return [
        {
            "id": f.id,
            "title": f.title,
            "description": f.description,
            "severity": f.severity,
            "category": f.category,
            "created_at": f.created_at,
        }
        for f in findings_sorted
    ]


@router.get("/score")
def get_risk_score(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    findings = db.query(RiskFinding).filter(RiskFinding.user_id == current_user.id).all()
    score = calculate_risk_score(findings)
    total = len(findings)
    critical = sum(1 for f in findings if f.severity == "critical")
    high = sum(1 for f in findings if f.severity == "high")
    return {
        "risk_score": score,
        "total_findings": total,
        "critical": critical,
        "high": high,
    }


@router.post("/analyze")
def reanalyze(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    """Re-run risk analysis on current accounts. Call this after a Gmail scan."""
    findings = analyze_and_save_risks(current_user.id, db)
    score = calculate_risk_score(findings)
    return {
        "risk_score": score,
        "total_findings": len(findings),
        "findings": [
            {"title": f.title, "severity": f.severity, "category": f.category}
            for f in findings
        ],
    }