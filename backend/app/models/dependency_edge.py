from sqlalchemy import Column
from sqlalchemy import Integer
from sqlalchemy import String

from app.db.database import Base


class DependencyEdge(Base):
    __tablename__ = "dependency_edges"

    id = Column(
        Integer,
        primary_key=True
    )

    source_type = Column(String)

    source_id = Column(Integer)

    target_type = Column(String)

    target_id = Column(Integer)

    relationship_type = Column(String)