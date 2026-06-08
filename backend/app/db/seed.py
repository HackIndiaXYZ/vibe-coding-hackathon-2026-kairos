# app/db/seed.py
from app.db.database import SessionLocal
from app.models.user import User
from app.models.email_identity import EmailIdentity
from app.models.phone_identity import PhoneIdentity
from app.models.acc_platform import PlatformAccount
from app.models.recovery_method import RecoveryMethod
from app.models.third_party_app import ThirdPartyApp
from app.models.account_permission import AccountPermission
from app.models.risk_finding import RiskFinding
from app.models.dependency_edge import DependencyEdge
import app.models

def seed():
    db = SessionLocal()

    # Prevent duplicate seeding
    if db.query(EmailIdentity).count() > 0:
        print("Data already exists")
        return

    # ------------------------
    # Emails
    # ------------------------
    emails = [
        EmailIdentity(
            email="trisha@gmail.com",
            is_primary=1,
            user_id=1
        ),
        EmailIdentity(
            email="trisha.work@gmail.com",
            is_primary=0,
            user_id=1
        ),
        EmailIdentity(
            email="trisha.college@gmail.com",
            is_primary=0,
            user_id=1
        )
    ]

    # ------------------------
    # Phones
    # ------------------------
    phones = [
        PhoneIdentity(
            phone_number="+919999999999",
            is_primary=1,
            user_id=1
        ),
        PhoneIdentity(
            phone_number="+918888888888",
            is_primary=0,
            user_id=1
        )
    ]

    # ------------------------
    # Accounts
    # ------------------------
    accounts = [
        PlatformAccount(platform_name="Google", username="trisha", has_2fa=True, user_id=1),
        PlatformAccount(platform_name="GitHub", username="trisha0505", has_2fa=True, user_id=1),
        PlatformAccount(platform_name="Instagram", username="trisha_ig", has_2fa=False, user_id=1),
        PlatformAccount(platform_name="LinkedIn", username="trisha_li", has_2fa=True, user_id=1),
        PlatformAccount(platform_name="Facebook", username="trisha_fb", has_2fa=False, user_id=1),
        PlatformAccount(platform_name="Twitter", username="trisha_x", has_2fa=False, user_id=1),
        PlatformAccount(platform_name="Discord", username="trisha_discord", has_2fa=True, user_id=1),
        PlatformAccount(platform_name="Reddit", username="trisha_reddit", has_2fa=False, user_id=1),
    ]

    db.add_all(emails)
    db.add_all(phones)
    db.add_all(accounts)

    db.commit()

    # ------------------------
    # Apps
    # ------------------------
    apps = [
        ThirdPartyApp(name="Notion", vendor="Notion"),
        ThirdPartyApp(name="Canva", vendor="Canva"),
        ThirdPartyApp(name="Slack", vendor="Slack"),
        ThirdPartyApp(name="Zoom", vendor="Zoom"),
        ThirdPartyApp(name="Spotify", vendor="Spotify"),
    ]

    db.add_all(apps)
    db.commit()

    # ------------------------
    # Permissions
    # ------------------------
    permissions = [
        AccountPermission(account_id=1, app_id=1, scope="email"),
        AccountPermission(account_id=1, app_id=2, scope="profile"),
        AccountPermission(account_id=2, app_id=3, scope="repo"),
        AccountPermission(account_id=2, app_id=4, scope="read:user"),
        AccountPermission(account_id=3, app_id=1, scope="photos"),
        AccountPermission(account_id=4, app_id=2, scope="contacts"),
        AccountPermission(account_id=5, app_id=3, scope="messages"),
        AccountPermission(account_id=6, app_id=4, scope="tweets"),
        AccountPermission(account_id=7, app_id=5, scope="servers"),
        AccountPermission(account_id=8, app_id=1, scope="history"),
    ]

    db.add_all(permissions)

    # ------------------------
    # Risks
    # ------------------------
    risks = [
        RiskFinding(
            title="No 2FA Enabled",
            severity="high",
            description="Instagram account has no 2FA",
            recommendation="Enable 2FA"
        ),
        RiskFinding(
            title="Password Reuse",
            severity="high",
            description="Password reused across services",
            recommendation="Use unique passwords"
        ),
        RiskFinding(
            title="Unused Account",
            severity="medium",
            description="Facebook inactive for 2 years",
            recommendation="Delete account"
        ),
        RiskFinding(
            title="Excessive Permissions",
            severity="medium",
            description="Third party apps have broad access",
            recommendation="Review permissions"
        ),
        RiskFinding(
            title="Recovery Email Exposure",
            severity="low",
            description="Old recovery email still attached",
            recommendation="Update recovery email"
        )
    ]

    db.add_all(risks)

    db.commit()

    print("Seed data inserted successfully")


if __name__ == "__main__":
    seed()