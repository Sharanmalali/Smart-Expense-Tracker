import shutil
import uuid
import os
from fastapi import APIRouter, Depends, HTTPException, status, UploadFile, File, Form
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import date # We'll use this for date parsing
import schemas, models, dependencies

router = APIRouter(
    prefix="/expenses",
    tags=["Expenses"]
)

# Define the path to the uploads directory relative to the main.py file
UPLOAD_DIRECTORY = "./uploads"

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIRECTORY, exist_ok=True)

@router.post("/", response_model=schemas.Expense)
def create_expense(
    # We use Form() because we are receiving multipart/form-data
    # This is required to be able to upload files
    category: str = Form(...),
    amount: float = Form(...),
    date: date = Form(...), # FastAPI will parse "YYYY-MM-DD"
    description: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None), # The optional uploaded file
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """
    Creates a new expense for the logged-in user.
    This endpoint accepts 'multipart/form-data'.
    """
    
    file_path = None
    if file:
        # Basic file validation
        if file.content_type not in ["image/jpeg", "image/png"]:
            raise HTTPException(status_code=400, detail="Invalid file type. Only JPG & PNG allowed.")
            
        # Generate a unique filename (e.g., 123e4567-e89b-12d3-a456-426614174000.jpg)
        file_extension = file.filename.split(".")[-1]
        unique_filename = f"{uuid.uuid4()}.{file_extension}"
        
        # This is the local path where we'll save the file
        local_file_path = os.path.join(UPLOAD_DIRECTORY, unique_filename)
        
        # Save the file
        try:
            with open(local_file_path, "wb") as buffer:
                shutil.copyfileobj(file.file, buffer)
        except Exception as e:
            raise HTTPException(status_code=500, detail=f"Error saving file: {e}")
        finally:
            file.file.close()
        
        # This is the web-accessible path we'll store in the DB
        file_path = f"/uploads/{unique_filename}" 

    # Create the database model
    db_expense = models.Expense(
        category=category,
        amount=amount,
        date=str(date), # Store date as string as per our model
        description=description,
        image_path=file_path,
        user_id=current_user.id # Link to the logged-in user
    )
    
    db.add(db_expense)
    db.commit()
    db.refresh(db_expense)
    
    return db_expense


@router.get("/", response_model=List[schemas.Expense])
def read_user_expenses(
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """Fetches all expenses for the currently logged-in user."""
    expenses = db.query(models.Expense).filter(models.Expense.user_id == current_user.id).all()
    return expenses


@router.delete("/{expense_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_expense(
    expense_id: int,
    db: Session = Depends(dependencies.get_db),
    current_user: models.User = Depends(dependencies.get_current_user)
):
    """Deletes an expense by ID."""
    
    # Find the expense
    expense = db.query(models.Expense).filter(models.Expense.id == expense_id).first()
    
    if not expense:
        raise HTTPException(status_code=404, detail="Expense not found")
        
    # CRITICAL: Verify the user owns this expense
    if expense.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized to delete this expense")
        
    # Optional: Delete the associated image file from disk
    if expense.image_path:
        # Convert web path /uploads/file.jpg to local path ./uploads/file.jpg
        local_image_path = "." + expense.image_path
        if os.path.exists(local_image_path):
            try:
                os.remove(local_image_path)
            except Exception as e:
                print(f"Error deleting file {local_image_path}: {e}") # Log error, but don't stop
            
    # Delete the expense from the database
    db.delete(expense)
    db.commit()
    
    # Return 204 No Content, so no response body
    return None