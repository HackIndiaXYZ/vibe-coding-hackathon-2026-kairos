from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.email_identity import EmailIdentity

router = APIRouter(
    prefix="/identities",
    tags=["Identities"]
)

@router.get("/emails")
def get_emails(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    emails = (
        db.query(EmailIdentity)
        .filter(
            EmailIdentity.user_id == current_user
        )
        .all()
    )

    return emails