from sqlalchemy.orm import Session
from src.models.order_activity_model import OrderActivity
from src.models.user_model import User
from src.models.order_model import Order
from src.schemas.order_schema import OrderCreate
from typing import List


def create_order_service(
    db: Session,
    order_data: OrderCreate,
    current_user: User
) -> Order:
    
    # Create Order
    new_order = Order(
        name=order_data.name,
        description=order_data.description,
        user_id=current_user.id,
        is_approved=False
    )

    db.add(new_order)
    db.commit()
    db.refresh(new_order)

    # Create Order Activity
    activity = OrderActivity(
        order_id=new_order.id,
        user_id=current_user.id
    )

    db.add(activity)
    db.commit()

    return new_order





def get_user_orders_service(
    db: Session,
    current_user: User
) -> List[Order]:

    orders = (
        db.query(Order)
        .filter(Order.user_id == current_user.id)
        .order_by(Order.created_at.desc())
        .all()
    )

    return orders
