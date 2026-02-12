from pydantic import BaseModel, Field, ConfigDict
from datetime import datetime

from Backend.src.schemas.order_schema import OrderResponse
from Backend.src.schemas.user_schema import UserResponse

class OrderActivityBase(BaseModel):
    order_id: int = Field(..., gt=0)
    user_id: int = Field(..., gt=0)

class OrderActivityCreate(OrderActivityBase):
    pass

class OrderActivityInDB(OrderActivityBase):
    id: int
    activity_time: datetime
    model_config = ConfigDict(from_attributes=True)

class OrderActivityResponse(OrderActivityInDB):
    pass

class OrderActivityWithDetails(OrderActivityResponse):
    order: OrderResponse
    user: UserResponse