from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database_models
from database import engine

# Create tables if they don't exist
database_models.Base.metadata.create_all(bind=engine)

# --- AUTO SEED STABLE ADMIN CREDENTIALS ---
from database import SessionLocal
import security
try:
    db = SessionLocal()
    admin_email = "supriyass@123.com"
    existing_admin = db.query(database_models.User).filter_by(email=admin_email).first()
    if not existing_admin:
        new_admin = database_models.User(
            email=admin_email,
            name="System Administrator",
            hashed_password=security.get_password_hash("password123"),
            role="admin",
            status="active"
        )
        db.add(new_admin)
        db.commit()
    elif existing_admin.role != "admin":
        existing_admin.role = "admin"
        db.commit()
finally:
    db.close()
# ------------------------------------------

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
