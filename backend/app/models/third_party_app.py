from sqlalchemy import Column, Integer, String

from app.db.database import Base


class ThirdPartyApp(Base):
    __tablename__ = "third_party_apps"

    id = Column(
        Integer,
        primary_key=True
    )

    name = Column(
        String,
        nullable=False
    )

    vendor = Column(
        String
    )

    risk_level = Column(
        String,
        default="low"
    )