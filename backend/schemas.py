from pydantic import BaseModel
from typing import Optional, List

# --- Expense Schemas ---
# (These are from Phase 1, no changes needed)
class ExpenseBase(BaseModel):
    category: str
    amount: float
    date: str # e.g., "2025-11-12"
    description: Optional[str] = None

class ExpenseCreate(ExpenseBase):
    pass

class Expense(ExpenseBase):
    id: int
    user_id: int
    image_path: Optional[str] = None

    class Config:
        orm_mode = True

# --- User Schemas ---
# (These are from Phase 1, no changes needed)
class UserBase(BaseModel):
    username: str
    email: str

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    monthly_income: Optional[float] = None
    expenses: List[Expense] = [] 

    class Config:
        orm_mode = True

# --- Token Schemas ---
# (These are from Phase 1, no changes needed)
class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    username: Optional[str] = None

# --- NEW SCHEMA FOR PHASE 2 ---
class IncomeUpdate(BaseModel):
    monthly_income: float