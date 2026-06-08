from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.db.database import get_db
from app.api.dependencies import get_current_user

from app.models.risk_finding import RiskFinding
from app.models.acc_platform import PlatformAccount
from app.services.risk_engine import (
    analyze_accounts,
    calculate_risk_score
)
from app.services.risk_engine import (
    analyze_accounts,
    calculate_risk_score
)

from app.models.acc_platform import PlatformAccount
from app.models.account_permission import AccountPermission
from app.models.third_party_app import ThirdPartyApp
from app.models.recovery_method import RecoveryMethod
router = APIRouter(
    prefix="/risks",
    tags=["Risks"]
)

@router.get("/")
def get_risks(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    return db.query(RiskFinding).all()
@router.post("/analyze")
def analyze_risks(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    accounts = (
        db.query(PlatformAccount)
        .filter(
            PlatformAccount.user_id == current_user
        )
        .all()
    )

    findings = analyze_accounts(accounts)

    score = calculate_risk_score(findings)

    return {
        "risk_score": score,
        "findings": findings
    }
@router.get("/score")
def get_score(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    accounts = (
        db.query(PlatformAccount)
        .filter(
            PlatformAccount.user_id == current_user
        )
        .all()
    )

    findings = analyze_accounts(accounts)

    return {
        "risk_score":
        calculate_risk_score(findings)
    }
@router.post("/analyze")
def analyze_risks(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    accounts = (
        db.query(PlatformAccount)
        .filter(
            PlatformAccount.user_id == current_user
        )
        .all()
    )

    permissions = db.query(
        AccountPermission
    ).all()

    apps = db.query(
        ThirdPartyApp
    ).all()

    recovery_methods = db.query(
        RecoveryMethod
    ).all()

    findings = analyze_accounts(
        accounts,
        permissions,
        apps,
        recovery_methods
    )

    score = calculate_risk_score(
        findings
    )

    return {
        "risk_score": score,
        "total_findings": len(findings),
        "findings": findings
    }
@router.get("/score")
def get_score(
    current_user: int = Depends(get_current_user),
    db: Session = Depends(get_db)
):

    accounts = (
        db.query(PlatformAccount)
        .filter(
            PlatformAccount.user_id == current_user
        )
        .all()
    )

    findings = analyze_accounts(
        accounts
    )

    return {
        "risk_score":
        calculate_risk_score(findings)
    }