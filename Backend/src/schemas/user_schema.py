from pydantic import BaseModel, Field, ConfigDict
from typing import Optional, List, TYPE_CHECKING
from enum import Enum

if TYPE_CHECKING:
    from src.schemas.order_schema import OrderResponse


class UserRole(str, Enum):
    ADMIN = "admin"
    USER = "user"


class UserBase(BaseModel):
    username: str = Field(..., min_length=1, max_length=100)
    role: UserRole


class UserCreate(UserBase):
    password: str = Field(..., min_length=6, max_length=255)


class UserUpdate(BaseModel):
    username: Optional[str] = Field(None, min_length=1, max_length=100)
    password: Optional[str] = Field(None, min_length=6, max_length=255)
    role: Optional[UserRole] = None


class UserInDB(UserBase):
    id: int
    model_config = ConfigDict(from_attributes=True)


class UserResponse(UserInDB):
    pass


class UserWithOrders(UserResponse):
    orders: List["OrderResponse"] = []


from src.schemas.order_schema import OrderResponse

UserWithOrders.model_rebuild()
