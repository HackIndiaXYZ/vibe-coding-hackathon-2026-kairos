from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.models import User, AccountPermission, PlatformAccount

router = APIRouter(prefix="/permissions", tags=["Permissions"])


@router.get("/")
def get_permissions(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    account_ids = [
        a.id for a in db.query(PlatformAccount)
        .filter(PlatformAccount.user_id == current_user.id).all()
    ]
    if not account_ids:
        return []
    return db.query(AccountPermission).filter(
        AccountPermission.account_id.in_(account_ids)
    ).all()