import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from config.environment import config

# We use the config module or fallback to SQLite if needed
# For local dev, SQLite is fine. 
database_url = os.environ.get("DATABASE_URL", "sqlite:///./asset_management.db")

# For SQLite, we need connect_args={"check_same_thread": False}
if database_url.startswith("sqlite"):
    engine = create_engine(database_url, connect_args={"check_same_thread": False})
else:
    engine = create_engine(database_url)

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

# Dependency to get db session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
