from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import database_models
from database import engine

# Create tables if they don't exist
database_models.Base.metadata.create_all(bind=engine)

from sqlalchemy import text
try:
    with engine.connect() as conn:
        conn.execute(text("ALTER TABLE assets ADD COLUMN image_url VARCHAR;"))
        conn.commit()
except Exception:
    pass

try:
    with engine.connect() as conn:
        conn.execute(text("DELETE FROM assets WHERE category = 'Furniture';"))
        conn.commit()
except Exception:
    pass

# --- AUTO SEED STABLE ADMIN & DEMO DATA ---
from database import SessionLocal
import security
import seed_data

try:
    db = SessionLocal()
    
    # 1. Seed Admin
    admin_email = "admin@company.com"
    if not db.query(database_models.User).filter_by(email=admin_email).first():
        db.add(database_models.User(email=admin_email, name="System Administrator", hashed_password=security.get_password_hash("Admin@123"), role="admin", status="active"))
    
    # 2. Seed Employees
    if not db.query(database_models.User).filter_by(email="priya@123.com").first():
        db.add(database_models.User(email="priya@123.com", name="Priya", hashed_password=security.get_password_hash("password123"), role="employee", status="active"))
    if not db.query(database_models.User).filter_by(email="alishan@789.com").first():
        db.add(database_models.User(email="alishan@789.com", name="Alishan", hashed_password=security.get_password_hash("password123"), role="employee", status="active"))
        
    db.commit()
    
    # 3. Seed Assets
    seed_data.seed_assets()
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
