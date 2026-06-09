from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.models import User, EmailIdentity, PhoneIdentity, PlatformAccount, AccountPermission, RiskFinding
from app.services.risk_engine import calculate_risk_score

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])


@router.get("/summary")
def dashboard_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    findings = db.query(RiskFinding).filter(RiskFinding.user_id == current_user.id).all()
    score = calculate_risk_score(findings)

    return {
        "total_emails":    db.query(EmailIdentity).filter(EmailIdentity.user_id == current_user.id).count(),
        "total_phones":    db.query(PhoneIdentity).filter(PhoneIdentity.user_id == current_user.id).count(),
        "total_accounts":  db.query(PlatformAccount).filter(PlatformAccount.user_id == current_user.id).count(),
        "total_risks":     len(findings),
        "risk_score":      score,
        "high_risk_count": sum(1 for f in findings if f.severity in ("high", "critical")),
    }