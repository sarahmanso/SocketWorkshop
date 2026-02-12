from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List
from datetime import datetime

from Backend.src.schemas.user_schema import UserResponse
from Backend.src.schemas.order_activity_schema import OrderActivityResponse

class OrderBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=150)
    description: Optional[str] = None

class OrderCreate(OrderBase):
    user_id: int = Field(..., gt=0)

class OrderUpdate(BaseModel):
    name: Optional[str] = Field(None, min_length=1, max_length=150)
    description: Optional[str] = None
    is_approved: Optional[bool] = None

class OrderInDB(OrderBase):
    id: int
    user_id: int
    is_approved: bool
    created_at: datetime
    model_config = ConfigDict(from_attributes=True)

class OrderResponse(OrderInDB):
    pass

class OrderWithUser(OrderResponse):
    user: UserResponse

class OrderWithActivities(OrderResponse):
    activities: List['OrderActivityResponse'] = []

class OrderDetailed(OrderResponse):
    user: UserResponse
    activities: List['OrderActivityResponse'] = []
