from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
# FIX 1: Use relative imports with '..' to find the files in the parent directory
import schemas, models, security, dependencies

router = APIRouter(
    prefix="/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=schemas.User)
def register_user(user: schemas.UserCreate, db: Session = Depends(dependencies.get_db)):
    """Registers a new user."""
    # Check if user or email already exists
    db_user = db.query(models.User).filter(
        (models.User.username == user.username) | (models.User.email == user.email)
    ).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Username or email already registered")

    # FIX 2: Change check to '> 71' (or '>= 72')
    # The real limit is 71 bytes, not 72.
    if len(user.password.encode('utf-8')) > 71:
        raise HTTPException(
            status_code=422, detail="Password is too long. Maximum 71 bytes."
        )
    # --- END OF FIX ---

    # Hash the password
    hashed_password = security.get_password_hash(user.password)

    # Create the new user model
    db_user = models.User(
        username=user.username,
        email=user.email,
        hashed_password=hashed_password
    )

    # Add to DB
    db.add(db_user)
    db.commit()
    db.refresh(db_user)

    return db_user

@router.post("/token", response_model=schemas.Token)
def login_for_access_token(form_data: OAuth2PasswordRequestForm = Depends(), db: Session = Depends(dependencies.get_db)):
    """Logs in a user and returns a JWT token."""
    # Find the user by username
    user = db.query(models.User).filter(models.User.username == form_data.username).first()
    
    # Check if user exists and password is correct
    if not user or not security.verify_password(form_data.password, user.hashed_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Create the access token
    access_token = security.create_access_token(
        data={"sub": user.username} # "sub" is the standard claim for the subject (the user)
    )
    
    return {"access_token": access_token, "token_type": "bearer"}