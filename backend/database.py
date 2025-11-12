from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# Define the database URL. SQLite will create this file in the same directory.
DATABASE_URL = "sqlite:///./sql_app.db"

# Create the SQLAlchemy engine
engine = create_engine(
    DATABASE_URL, 
    # This setting is needed only for SQLite to allow multiple threads
    connect_args={"check_same_thread": False} 
)

# Create a SessionLocal class, which will be our actual database session
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class for our models to inherit from
Base = declarative_base()