from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user

from app.models.user import User

router = APIRouter(
    prefix="/user",
    tags=["User"]
)


@router.get("/profile")
def get_profile(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    user = (
        db.query(User)
        .filter(User.id == current_user)
        .first()
    )

    return user