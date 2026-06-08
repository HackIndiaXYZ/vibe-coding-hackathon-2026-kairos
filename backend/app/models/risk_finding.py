from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String
from sqlalchemy import Text

from app.db.database import Base


class RiskFinding(Base):
    __tablename__ = "risk_findings"

    id = Column(
        Integer,
        primary_key=True
    )

    title = Column(String)

    severity = Column(String)

    description = Column(Text)

    recommendation = Column(Text)