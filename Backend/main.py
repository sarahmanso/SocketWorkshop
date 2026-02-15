from fastapi import FastAPI
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

app.include_router(auth_router)
app.include_router(order_router)
app.include_router(order_activity_router)
    
