from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import ForeignKey

from sqlalchemy.orm import relationship

from app.db.database import Base


class EmailIdentity(Base):
    __tablename__ = "email_identities"

    id = Column(
        Integer,
        primary_key=True
    )

    email = Column(
        String,
        nullable=False
    )

    is_primary = Column(
        Integer,
        default=0
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id")
    )

    user = relationship(
        "User",
        back_populates="emails"
    )