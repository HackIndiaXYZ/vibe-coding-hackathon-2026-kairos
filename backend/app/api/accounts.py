from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user

from app.models.acc_platform import PlatformAccount

router = APIRouter(
    prefix="/accounts",
    tags=["Accounts"]
)

@router.get("/")
def get_accounts(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(PlatformAccount)
        .filter(
            PlatformAccount.user_id == current_user
        )
        .all()
    )