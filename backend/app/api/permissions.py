from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user

from app.models.account_permission import AccountPermission

router = APIRouter(
    prefix="/permissions",
    tags=["Permissions"]
)

@router.get("/")
def get_permissions(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(AccountPermission).all()