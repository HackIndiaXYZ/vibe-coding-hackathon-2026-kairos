from fastapi import APIRouter, Depends
from app.api.dependencies import get_current_user
from app.models.models import User

router = APIRouter(prefix="/profile", tags=["Profile"])

@router.get("/")
def get_profile(current_user: User = Depends(get_current_user)):
    return {
        "id": current_user.id,
        "full_name": current_user.full_name,
        "email": current_user.email,
        "avatar_url": current_user.avatar_url,
        "created_at": current_user.created_at,
    }