from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database_models
from database import engine

# Create tables if they don't exist
database_models.Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Company Asset Management System API",
    description="Backend API for managing properties, assets and user assignments",
    version="1.0.0"
)

from routers import auth, users, assets, tickets

# CORS Rules
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/auth", tags=["Auth"])
app.include_router(users.router, prefix="/api/users", tags=["Users"])
app.include_router(assets.router, prefix="/api/assets", tags=["Assets"])
app.include_router(tickets.router, prefix="/api/tickets", tags=["Tickets"])

@app.get("/health")
def read_health():
    return {"status": "Database Initialized and API Running"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
