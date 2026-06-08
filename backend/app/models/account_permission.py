from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey
from sqlalchemy.orm import relationship
from app.db.database import Base


class AccountPermission(Base):
    __tablename__ = "account_permissions"

    id = Column(
        Integer,
        primary_key=True
    )

    account_id = Column(
        Integer,
        ForeignKey("platform_accounts.id")
    )

    app_id = Column(
        Integer,
        ForeignKey("third_party_apps.id")
    )

    scope = Column(String)

    risk_level = Column(
        String,
        default="low"
    )
    account = relationship(
    "PlatformAccount",
    back_populates="permissions"
)

app = relationship(
    "ThirdPartyApp"
)