from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Boolean
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from app.db.database import Base


class PlatformAccount(Base):
    __tablename__ = "platform_accounts"

    id = Column(
        Integer,
        primary_key=True
    )

    platform_name = Column(
        String,
        nullable=False
    )

    username = Column(
        String,
        nullable=False
    )

    has_2fa = Column(
        Boolean,
        default=False
    )

    risk_level = Column(
        String,
        default="low"
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship(
        "User",
        back_populates="accounts"
    )