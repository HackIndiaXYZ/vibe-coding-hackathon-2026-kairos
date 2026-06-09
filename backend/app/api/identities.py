from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
 
from app.db.database import get_db
from app.api.dependencies import get_current_user
from app.models.models import User, EmailIdentity, PhoneIdentity
 
emails_router = APIRouter(prefix="/identities/emails", tags=["Identities"])
phones_router = APIRouter(prefix="/identities/phones", tags=["Identities"])
 
 
@emails_router.get("/")
def get_emails(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(EmailIdentity).filter(EmailIdentity.user_id == current_user.id).all()
 
 
@phones_router.get("/")
def get_phones(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return db.query(PhoneIdentity).filter(PhoneIdentity.user_id == current_user.id).all()
 