from app.db.database import Base, engine
from app.models.models import (
    User, EmailIdentity, PhoneIdentity,
    PlatformAccount, AccountPermission, RiskFinding
)

def init_db():
    Base.metadata.create_all(bind=engine)