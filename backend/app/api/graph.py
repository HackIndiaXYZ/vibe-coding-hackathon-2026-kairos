from fastapi import APIRouter
from fastapi import Depends

from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user

from app.models.email_identity import EmailIdentity
from app.models.phone_identity import PhoneIdentity
from app.models.acc_platform import PlatformAccount
from app.models.account_permission import AccountPermission
from app.models.risk_finding import RiskFinding

router = APIRouter(
    prefix="/graph",
    tags=["Graph"]
)


@router.get("/")
def graph_data(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return {
        "emails":
        db.query(EmailIdentity)
        .filter(
            EmailIdentity.user_id == current_user
        )
        .all(),

        "phones":
        db.query(PhoneIdentity)
        .filter(
            PhoneIdentity.user_id == current_user
        )
        .all(),

        "accounts":
        db.query(PlatformAccount)
        .filter(
            PlatformAccount.user_id == current_user
        )
        .all(),

        "permissions":
        db.query(AccountPermission)
        .all(),

        "risks":
        db.query(RiskFinding)
        .all()
    }