from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db
from sqlalchemy import text
from fastapi.middleware.cors import CORSMiddleware

from src.routes.order_route import router as order_router
from src.routes.auth_route import router as auth_router
from src.routes.order_activity_routes import router as order_activity_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.get("/db-check")
def db_check(db: Session = Depends(get_db)):
    try:
        result = db.execute(text("SELECT 1")).fetchone()
        return {
            "status": "connected",
            "message": "Database connection successful",
            "result": result[0]
        }
    except Exception as e:
        return {
            "status": "error",
            "message": f"Database connection failed: {str(e)}"
        }
    
app.include_router(auth_router)
app.include_router(order_router)
app.include_router(order_activity_router)
    
