from sqlalchemy import Column, Integer, String, CheckConstraint
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    role = Column(String(10), nullable=False)
    
    __table_args__ = (
        CheckConstraint("role IN ('admin', 'user')", name='check_user_role'),
    )
    
    # relationships
    orders = relationship("Order", back_populates="user", cascade="all, delete-orphan")
    activities = relationship("OrderActivity", back_populates="user", cascade="all, delete-orphan")
    
    def __repr__(self):
        return f"<User(id={self.id}, username='{self.username}', role='{self.role}')>"
