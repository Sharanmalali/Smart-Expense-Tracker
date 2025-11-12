from sqlalchemy import Column, Integer, String, REAL, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    monthly_income = Column(REAL, nullable=True)

    # This creates the relationship: one User has many Expenses
    expenses = relationship("Expense", back_populates="owner")

class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    category = Column(String, index=True)
    amount = Column(REAL)
    description = Column(String, nullable=True)
    date = Column(String) # Storing as string (e.g., "YYYY-MM-DD") for simplicity
    image_path = Column(String, nullable=True)
    
    user_id = Column(Integer, ForeignKey("users.id"))

    # This links back to the User model
    owner = relationship("User", back_populates="expenses")