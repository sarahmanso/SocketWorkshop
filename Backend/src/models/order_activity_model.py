from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from database import Base

class OrderActivity(Base):
    __tablename__ = "order_activity"
    
    id = Column(Integer, primary_key=True, index=True)
    order_id = Column(Integer, ForeignKey("orders.id", ondelete="CASCADE"), nullable=False)
    user_id = Column(Integer, ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    activity_time = Column(DateTime(timezone=True), server_default=func.now(), nullable=False)
    
    # relationships
    order = relationship("Order", back_populates="activities")
    user = relationship("User", back_populates="activities")
    
    def __repr__(self):
        return f"<OrderActivity(id={self.id}, order_id={self.order_id}, user_id={self.user_id})>"