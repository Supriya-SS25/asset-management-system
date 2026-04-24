from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from pydantic import BaseModel

import database_models
from database import get_db
from routers.auth import get_current_user, get_current_active_admin

router = APIRouter()

# Simple schemas inline for brevity. Can be moved to models/asset.py
class AssetCreate(BaseModel):
    asset_name: str
    category: str
    cost: float
    image_url: str | None = None
    status: str = "available"

class AssetAssign(BaseModel):
    user_id: int

@router.get("/")
def get_assets(db: Session = Depends(get_db), current_user: database_models.User = Depends(get_current_user)):
    if current_user.role == database_models.RoleEnum.admin.value:
        assets = db.query(database_models.Asset).all()
    else:
        assets = db.query(database_models.Asset).filter(database_models.Asset.assigned_user_id == current_user.id).all()
    
    result = []
    for asset in assets:
        result.append({
            "id": asset.id,
            "asset_name": asset.asset_name,
            "category": asset.category,
            "cost": asset.cost,
            "image_url": asset.image_url,
            "status": asset.status,
            "assigned_user_id": asset.assigned_user_id,
            "assigned_user_name": asset.assigned_user.name if asset.assigned_user else None,
            "purchase_date": asset.purchase_date.isoformat() if asset.purchase_date else None
        })
    return result

@router.post("/")
def create_asset(asset: AssetCreate, db: Session = Depends(get_db), admin: database_models.User = Depends(get_current_active_admin)):
    db_asset = database_models.Asset(**asset.dict())
    db.add(db_asset)
    db.commit()
    db.refresh(db_asset)
    return db_asset

@router.post("/{asset_id}/assign")
def assign_asset(asset_id: int, assign_data: AssetAssign, db: Session = Depends(get_db), admin: database_models.User = Depends(get_current_active_admin)):
    asset = db.query(database_models.Asset).filter(database_models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    user = db.query(database_models.User).filter(database_models.User.id == assign_data.user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
        
    asset.assigned_user_id = user.id
    asset.status = database_models.AssetStatusEnum.assigned.value
    
    history = database_models.AssetHistory(
        asset_id=asset.id,
        action=f"Assigned to {user.name}",
        performed_by_id=admin.id,
        target_user_id=user.id
    )
    db.add(asset)
    db.add(history)
    db.commit()
    return {"status": "Asset Assigned Successfully", "asset": asset}

@router.post("/{asset_id}/return_request")
def return_request_asset(asset_id: int, db: Session = Depends(get_db), current_user: database_models.User = Depends(get_current_user)):
    asset = db.query(database_models.Asset).filter(database_models.Asset.id == asset_id).first()
    if not asset:
        raise HTTPException(status_code=404, detail="Asset not found")
    
    if asset.assigned_user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only request to return your own assigned assets")
        
    if asset.status == database_models.AssetStatusEnum.return_requested.value:
        raise HTTPException(status_code=400, detail="Return already requested for this asset")
        
    asset.status = database_models.AssetStatusEnum.return_requested.value
    
    history = database_models.AssetHistory(
        asset_id=asset.id,
        action="Return Requested",
        performed_by_id=current_user.id,
        target_user_id=current_user.id
    )
    db.add(asset)
    db.add(history)
    db.commit()
    return {"status": "Return request submitted successfully", "asset": asset}
