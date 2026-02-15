from sqlalchemy.orm import Session, joinedload
from typing import List
from src.models.order_activity_model import OrderActivity


def get_all_activities(db: Session, skip: int = 0, limit: int = 100) -> List[OrderActivity]:
    activities = (
        db.query(OrderActivity)
        .options(
            joinedload(OrderActivity.user),
            joinedload(OrderActivity.order)
        )
        .order_by(OrderActivity.activity_time.desc())
        .offset(skip)
        .limit(limit)
        .all()
    )
    return activities