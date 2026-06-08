from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.db.database import Base


class RecoveryMethod(Base):
    __tablename__ = "recovery_methods"

    id = Column(Integer, primary_key=True)

    method_type = Column(String)
    value = Column(String)

    account_id = Column(
        Integer,
        ForeignKey("platform_accounts.id")
    )

    account = relationship(
    "PlatformAccount",
    back_populates="recovery_methods"
)