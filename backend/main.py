from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware

import models
from database import engine
# 1. Import the new router
from routers import auth, users, expenses, analysis 

models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Smart Expense Tracker API",
    description="API for managing personal expenses and analytics.",
    version="1.0.0"
)

# --- CORS Configuration ---
origins = [
    "http://localhost:3000",
    "http://localhost:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Mount Static Files Directory ---
app.mount("/uploads", StaticFiles(directory="uploads"), name="uploads")

# --- Include Routers ---
app.include_router(auth.router)
app.include_router(users.router)
app.include_router(expenses.router)
# 2. Add the new analysis router
app.include_router(analysis.router) 

# --- "Hello World" Root Endpoint ---
@app.get("/")
def read_root():
    return {"message": "Welcome to the Smart Expense Tracker API"}