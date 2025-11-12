from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
import schemas, security, models
from database import SessionLocal
from sqlalchemy.orm import Session

# This tells FastAPI what URL to check for the token (our /auth/token endpoint)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="auth/token")

def get_db():
    """Dependency to get a database session for each request."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    """
    Dependency to get the current user from a token.
    This will be used to protect routes.
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    token_data = security.verify_token(token, credentials_exception)
    
    # Get the user from the database
    user = db.query(models.User).filter(models.User.username == token_data.username).first()
    if user is None:
        raise credentials_exception
        
    return user # We can now inject this user object into our path operations