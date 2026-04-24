from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional
from datetime import datetime
from pydantic import BaseModel

from database import get_db
import database_models as models
from routers.auth import get_current_user

router = APIRouter()

class TicketCreate(BaseModel):
    asset_id: Optional[int] = None
    request_type: str
    description: str

class TicketUpdateStatus(BaseModel):
    status: str

@router.post("/")
def create_ticket(ticket: TicketCreate, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    db_ticket = models.Ticket(
        user_id=current_user.id,
        asset_id=ticket.asset_id,
        request_type=ticket.request_type,
        description=ticket.description
    )
    db.add(db_ticket)
    db.commit()
    db.refresh(db_ticket)
    return db_ticket

@router.get("/")
def get_tickets(db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role == "admin":
        return db.query(models.Ticket).all()
    # Employees only see their own tickets
    return db.query(models.Ticket).filter(models.Ticket.user_id == current_user.id).all()

@router.put("/{ticket_id}/status")
def update_ticket_status(ticket_id: int, status_update: TicketUpdateStatus, db: Session = Depends(get_db), current_user: models.User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    
    db_ticket = db.query(models.Ticket).filter(models.Ticket.id == ticket_id).first()
    if not db_ticket:
        raise HTTPException(status_code=404, detail="Ticket not found")

    db_ticket.status = status_update.status
    if status_update.status in ["resolved", "rejected"]:
        db_ticket.resolved_at = datetime.utcnow()
        
        # If it was an approved maintenance request, update the asset status
        if status_update.status == "resolved" and db_ticket.request_type == "maintenance" and db_ticket.asset_id:
            asset = db.query(models.Asset).filter(models.Asset.id == db_ticket.asset_id).first()
            if asset:
                asset.status = "maintenance"
    
    db.commit()
    db.refresh(db_ticket)
    return db_ticket
