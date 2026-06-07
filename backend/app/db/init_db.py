from app.db.database import Base
from app.db.database import engine

from app.models.user import User
from app.models.email_identity import EmailIdentity
from app.models.phone_identity import PhoneIdentity
from app.models.acc_platform import PlatformAccount


def init_db():
    Base.metadata.create_all(
        bind=engine
    )