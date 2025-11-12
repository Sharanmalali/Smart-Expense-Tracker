from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import schemas, models, dependencies

router = APIRouter(
    prefix="/users",
    tags=["Users"]
)

@router.get("/me", response_model=schemas.User)
def read_users_me(current_user: models.User = Depends(dependencies.get_current_user)):
    """
    Fetches the details for the currently logged-in user.
    """
    return current_user

# --- NEW ENDPOINT FOR PHASE 2 ---
@router.put("/me/income", response_model=schemas.User)
def update_user_income(
    income_data: schemas.IncomeUpdate, # Takes the new schema
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """Updates the monthly income for the current user."""
    
    # Update the user model in the database
    current_user.monthly_income = income_data.monthly_income
    db.add(current_user)
    db.commit()
    db.refresh(current_user)
    
    return current_user