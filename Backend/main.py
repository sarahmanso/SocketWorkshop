from fastapi import FastAPI, Depends
from sqlalchemy.orm import Session
from database import get_db, engine
from sqlalchemy import text

app = FastAPI()

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