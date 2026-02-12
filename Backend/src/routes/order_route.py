from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..services.order_service import approve_order_service, create_order_service, get_user_orders_service
from typing import List
from ..utils.auth_utils import get_current_active_admin, get_current_user
from database import get_db
from src.schemas.order_schema import OrderCreate, OrderResponse
from src.models.user_model import User

router = APIRouter(prefix="/orders", tags=["Orders"])


@router.post(
    "/",
    response_model=OrderResponse,
    status_code=status.HTTP_201_CREATED
)
def create_order(
    order_data: OrderCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return create_order_service(db, order_data, current_user)




@router.get(
    "/my-orders",
    response_model=List[OrderResponse]
)
def get_my_orders(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return get_user_orders_service(db, current_user)



@router.patch(
    "/{order_id}/approve",
    response_model=OrderResponse,
    status_code=status.HTTP_200_OK
)
def approve_order(
    order_id: int,
    db: Session = Depends(get_db),
    current_admin = Depends(get_current_active_admin)
):
   
    return approve_order_service(db, order_id)
