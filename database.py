import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config.environment import config

# Use the config module
database_url = config.database_url

# Enforce PostgreSQL in production, no SQLite fallback allowed
if config.is_production():
    if not database_url:
        raise ValueError("CRITICAL ERROR: DATABASE_URL environment variable is required in production. Do not use SQLite.")
    if "sqlite" in database_url.lower():
        raise ValueError("CRITICAL ERROR: SQLite database URL provided but production requires PostgreSQL. Update DATABASE_URL.")
else:
    # Fallback for local development or staging if environment variable is missing
    if not database_url:
        database_url = "sqlite:///./asset_management.db"

# SQLAlchemy 1.4+ requires 'postgresql://' instead of 'postgres://'
if database_url and database_url.startswith("postgres://"):
    database_url = database_url.replace("postgres://", "postgresql://", 1)

print(f"Database connection initialized. Environment: {config.environment}. Using database type: {'SQLite' if 'sqlite' in database_url else 'PostgreSQL'}")

# For SQLite, we need connect_args={"check_same_thread": False}
if database_url.startswith("sqlite"):
    engine = create_engine(database_url, connect_args={"check_same_thread": False})
else:
    # Ensure connections aren't dropped by the DB proxy/load balancer
    engine = create_engine(database_url, pool_pre_ping=True, pool_recycle=3600)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
