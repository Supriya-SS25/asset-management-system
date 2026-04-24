import sys
from database import SessionLocal
import database_models
from security import get_password_hash

def create_admin(email, password):
    db = SessionLocal()
    existing = db.query(database_models.User).filter_by(email=email).first()
    if existing:
        existing.role = "admin"
        existing.hashed_password = get_password_hash(password)
        print(f"✅ Success! Updated existing user '{email}' to an Admin.")
    else:
        admin = database_models.User(
            email=email,
            name="System Administrator",
            role="admin",
            status="active",
            hashed_password=get_password_hash(password)
        )
        db.add(admin)
        print(f"✅ Success! Created new Admin user '{email}'.")
    db.commit()
    db.close()

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python create_custom_admin.py <email> <password>")
    else:
        create_admin(sys.argv[1], sys.argv[2])
