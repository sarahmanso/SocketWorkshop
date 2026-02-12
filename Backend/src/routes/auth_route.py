from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from database import get_db
from ..schemas.auth_schema import UserLogin, Token
from ..schemas.user_schema import UserCreate, UserResponse
from ..services.auth_service import register_user, login as login_user
from ..utils.auth_utils import get_current_user, get_current_active_admin  
from ..models.user_model import User

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def register(user_data: UserCreate, db: Session = Depends(get_db)):
    return register_user(user_data, db)


@router.post("/login", response_model=Token)
def login(login_data: UserLogin, db: Session = Depends(get_db)):
    return login_user(login_data, db)


@router.get("/me", response_model=UserResponse)
def get_current_user_info(current_user: User = Depends(get_current_user)):
    return UserResponse.model_validate(current_user)


@router.get("/verify-token")
def verify_token(current_user: User = Depends(get_current_user)):
    return {
        "valid": True,
        "username": current_user.username,
        "role": current_user.role
    }


@router.get("/admin-only")
def admin_only_route(admin_user: User = Depends(get_current_active_admin)):
    return {
        "message": "Welcome admin!",
        "admin_username": admin_user.username
    }