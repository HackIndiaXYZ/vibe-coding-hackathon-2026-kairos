from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy.orm import relationship

from app.db.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    full_name = Column(
        String,
        nullable=False
    )

    email = Column(
        String,
        unique=True,
        nullable=False
    )

    password_hash = Column(
        String,
        nullable=False
    )

    emails = relationship(
        "EmailIdentity",
        back_populates="user"
    )

    phones = relationship(
        "PhoneIdentity",
        back_populates="user"
    )

    accounts = relationship(
        "PlatformAccount",
        back_populates="user"
    )