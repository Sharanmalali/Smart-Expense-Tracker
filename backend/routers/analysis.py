import pandas as pd
import numpy as np
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import Dict, Any
import models, dependencies
from fastapi import Query

router = APIRouter(
    prefix="/analysis",
    tags=["Analysis"],
    # All routes here will require a logged-in user
    dependencies=[Depends(dependencies.get_current_user)]
)

# --- Helper Function ---
def get_expenses_dataframe(db: Session, user_id: int) -> pd.DataFrame:
    """
    Fetches all expenses for a user and loads them into a Pandas DataFrame.
    Returns an empty DataFrame if no expenses are found.
    """
    # Query the database
    expenses = db.query(models.Expense).filter(models.Expense.user_id == user_id).all()
    
    if not expenses:
        # Return an empty DataFrame with expected columns
        return pd.DataFrame(columns=["id", "category", "amount", "date", "user_id"])

    # Convert the list of SQLAlchemy models to a list of dictionaries
    expenses_data = [
        {
            "id": exp.id,
            "category": exp.category,
            "amount": exp.amount,
            "date": exp.date,
            "user_id": exp.user_id
        }
        for exp in expenses
    ]
    
    # Create and return the DataFrame
    df = pd.DataFrame(expenses_data)
    
    # Convert date column to datetime objects for time-based analysis
    df['date'] = pd.to_datetime(df['date'])
    
    return df

# --- Analytics Endpoints ---

@router.get("/summary", response_model=Dict[str, Any])
def get_expense_summary(
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """
    Provides a quick summary of all-time expenses: total, average, and count.
    """
    df = get_expenses_dataframe(db, current_user.id)
    
    if df.empty:
        return {
            "total_expenses": 0,
            "average_expense": 0,
            "expense_count": 0
        }

    # Use NumPy for fast calculations
    total_expenses = np.sum(df['amount'])
    average_expense = np.mean(df['amount'])
    expense_count = len(df)
    
    return {
        "total_expenses": total_expenses,
        "average_expense": average_expense,
        "expense_count": expense_count
    }

@router.get("/by-category", response_model=Dict[str, float])
def get_expenses_by_category(
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """
    Returns the total sum of expenses grouped by category.
    """
    
    df = get_expenses_dataframe(db, current_user.id)
    
    if df.empty:
        return {}
        
    # Use Pandas 'groupby' to sum amounts for each category
    category_totals = df.groupby('category')['amount'].sum()
    
    # Convert the Pandas Series to a dictionary for JSON response
    return category_totals.to_dict()

@router.get("/income-vs-expense", response_model=Dict[str, float])
def get_income_vs_expense(
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """
    Compares total monthly income to total all-time expenses.
    Note: A more "correct" version might filter expenses by month.
    For this project, we'll compare against all-time spend.
    """
    df = get_expenses_dataframe(db, current_user.id)
    
    total_spent = 0.0
    if not df.empty:
        total_spent = np.sum(df['amount'])
        
    income = current_user.monthly_income or 0.0
    saved = income - total_spent
    
    return {
        "income": income,
        "spent": total_spent,
        "saved": saved # This might be negative if they've overspent
    }

@router.get("/daily-trend", response_model=Dict[str, float])
def get_daily_expense_trend(
    month: str = Query(..., description="Format: YYYY-MM"),
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """
    Returns total expenses for each DAY of the given month.
    Example:
    {
        "2025-11-01": 20.5,
        "2025-11-02": 0,
        "2025-11-03": 50.25
    }
    """
    df = get_expenses_dataframe(db, current_user.id)

    if df.empty:
        return {}

    # Ensure 'date' is datetime
    df['date'] = pd.to_datetime(df['date'])

    # Filter for the requested month (YYYY-MM)
    df_month = df[df['date'].dt.strftime('%Y-%m') == month]

    if df_month.empty:
        return {}

    # Resample per day — sum each day's spending
    df_month = df_month.set_index('date')
    daily_totals = df_month['amount'].resample('D').sum()

    # Ensure index formatted as YYYY-MM-DD
    daily_totals.index = daily_totals.index.strftime('%Y-%m-%d')

    # Convert to dictionary
    return daily_totals.to_dict()