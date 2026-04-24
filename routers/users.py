from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from pydantic import BaseModel

import database_models
from database import get_db
from security import get_password_hash, verify_password
from routers.auth import get_current_user, get_current_active_admin
from models.user import UserCreate, UserUpdate, UserResponse

router = APIRouter()

class ChangePassword(BaseModel):
    current_password: str
    new_password: str

@router.get("/", response_model=list)
def get_users(db: Session = Depends(get_db), admin: database_models.User = Depends(get_current_active_admin)):
    users = db.query(database_models.User).all()
    return [{
        "id": u.id, 
        "email": u.email, 
        "name": u.name, 
        "role": u.role, 
        "status": u.status,
        "created_at": u.created_at
    } for u in users]

@router.post("/")
def create_user(user: UserCreate, db: Session = Depends(get_db)):
    # Note: in a real system we'd probably restrict this to admin, or allow public reg for employees.
    # For now let's just make it public so we can bootstrap the first user.
    normalized_email = user.email.strip().lower()
    db_user = db.query(database_models.User).filter(database_models.User.email == normalized_email).first()
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Hash the user's secure custom password or default one
    password_to_hash = user.password if user.password else "password123"
    hashed_password = get_password_hash(password_to_hash)
    
    # Let the API dictate the role instead of hardcoding "employee" if requested
    role_to_assign = user.role if user.role in ["admin", "employee"] else "employee"
    
    # Automatically grant admin role to known admin emails
    if normalized_email in ["supriya@123.com", "supriyass@123.com"]:
        role_to_assign = "admin"

    db_user = database_models.User(
        email=normalized_email,
        name=user.name,
        hashed_password=hashed_password,
        role=role_to_assign,
        status="active"
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return {
        "id": db_user.id, 
        "email": db_user.email, 
        "name": db_user.name, 
        "role": db_user.role, 
        "status": db_user.status,
        "created_at": db_user.created_at
    }

@router.put("/{user_id}")
def update_user(user_id: int, user_update: UserUpdate, db: Session = Depends(get_db), admin: database_models.User = Depends(get_current_active_admin)):
    u = db.query(database_models.User).filter(database_models.User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
        
    if user_update.name is not None:
        u.name = user_update.name
    if user_update.email is not None:
        normalized_email = user_update.email.strip().lower()
        existing = db.query(database_models.User).filter(database_models.User.email == normalized_email, database_models.User.id != user_id).first()
        if existing:
            raise HTTPException(status_code=400, detail="Email already in use")
        u.email = normalized_email
        
    db.commit()
    db.refresh(u)
    return {"status": "User updated", "user": {"id": u.id, "email": u.email, "name": u.name}}

@router.delete("/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), admin: database_models.User = Depends(get_current_active_admin)):
    u = db.query(database_models.User).filter(database_models.User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    db.delete(u)
    db.commit()
    return {"status": "User deleted"}

@router.put("/{user_id}/role")
def update_user_role(user_id: int, payload: dict, db: Session = Depends(get_db), admin: database_models.User = Depends(get_current_active_admin)):
    role = payload.get("role")
    if not role:
        raise HTTPException(status_code=400, detail="Role is required")
        
    u = db.query(database_models.User).filter(database_models.User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
    
    if role not in ["admin", "employee"]:
        raise HTTPException(status_code=400, detail="Invalid role specified")
        
    u.role = role
    db.commit()
    db.refresh(u)
    return {"status": f"User role updated to {role}", "user": {"id": u.id, "role": u.role}}

@router.put("/{user_id}/status")
def update_user_status(user_id: int, payload: dict, db: Session = Depends(get_db), admin: database_models.User = Depends(get_current_active_admin)):
    status = payload.get("status")
    if not status:
        raise HTTPException(status_code=400, detail="Status is required")
        
    u = db.query(database_models.User).filter(database_models.User.id == user_id).first()
    if not u:
        raise HTTPException(status_code=404, detail="User not found")
        
    if status not in ["active", "inactive"]:
        raise HTTPException(status_code=400, detail="Invalid status specified")
        
    u.status = status
    db.commit()
    db.refresh(u)
    return {"status": f"User status updated to {status}", "user": {"id": u.id, "status": u.status}}

@router.post("/change_password")
def change_password(payload: ChangePassword, db: Session = Depends(get_db), current_user: database_models.User = Depends(get_current_user)):
    if not verify_password(payload.current_password, current_user.hashed_password):
        raise HTTPException(status_code=400, detail="Incorrect current password")
        
    current_user.hashed_password = get_password_hash(payload.new_password)
    db.commit()
    return {"status": "Password updated successfully"}

@router.get("/me/history")
def get_my_history(db: Session = Depends(get_db), current_user: database_models.User = Depends(get_current_user)):
    history = db.query(database_models.AssetHistory).filter(database_models.AssetHistory.target_user_id == current_user.id).order_by(database_models.AssetHistory.date.desc()).all()
    result = []
    for h in history:
        result.append({
            "id": h.id,
            "asset_id": h.asset_id,
            "asset_name": h.asset.asset_name if h.asset else "Unknown Asset",
            "action": h.action,
            "date": h.date.isoformat(),
        })
    return result
