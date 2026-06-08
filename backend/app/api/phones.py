from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.phone_identity import PhoneIdentity

router = APIRouter(
    prefix="/identities",
    tags=["Phones"]
)

@router.get("/phones")
def get_phones(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return (
        db.query(PhoneIdentity)
        .filter(PhoneIdentity.user_id == current_user)
        .all()
    )