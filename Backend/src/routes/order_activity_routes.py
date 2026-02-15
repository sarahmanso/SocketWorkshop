from fastapi import APIRouter, Depends, status
from fastapi.responses import JSONResponse
from sqlalchemy.orm import Session
from typing import List

from database import get_db
from ..models.user_model import User
from ..utils.auth_utils import get_current_user  
from src.schemas.order_activity_schema import OrderActivityWithDetails
from src.services import order_activity_service


router = APIRouter(prefix="/order-activities", tags=["Order Activities"])


@router.get(
    "/",
    response_model=List[OrderActivityWithDetails],
    status_code=status.HTTP_200_OK
)
def get_all_order_activities(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    activities = order_activity_service.get_all_activities(db, skip, limit)
    return activities

