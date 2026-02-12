from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from ..services import create_order_service, get_user_orders_service
from typing import List
from ..utils.auth_utils import get_current_user
from database import get_db
from schemas.order_schema import OrderCreate, OrderResponse
from models import User

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
