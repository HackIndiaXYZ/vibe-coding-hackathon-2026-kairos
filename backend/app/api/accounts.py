from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.models import User, PlatformAccount

router = APIRouter(prefix="/accounts", tags=["Accounts"])


@router.get("/")
def get_accounts(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    accounts = (
        db.query(PlatformAccount)
        .filter(PlatformAccount.user_id == current_user.id)
        .order_by(PlatformAccount.risk_level.desc(), PlatformAccount.platform_name)
        .all()
    )
    return [
        {
            "id": a.id,
            "domain": a.domain,
            "platform_name": a.platform_name,
            "category": a.category,
            "risk_level": a.risk_level,
            "has_2fa": a.has_2fa,
            "discovered_at": a.discovered_at,
        }
        for a in accounts
    ]


@router.get("/summary")
def accounts_summary(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    accounts = db.query(PlatformAccount).filter(PlatformAccount.user_id == current_user.id).all()
    by_category = {}
    for a in accounts:
        by_category.setdefault(a.category, 0)
        by_category[a.category] += 1
    return {
        "total": len(accounts),
        "by_category": by_category,
        "high_risk_count": sum(1 for a in accounts if a.risk_level == "high"),
    }