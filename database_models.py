from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime, Date, Enum
from sqlalchemy.orm import relationship
from datetime import datetime
import enum
from database import Base

class RoleEnum(str, enum.Enum):
    admin = "admin"
    employee = "employee"

class AssetStatusEnum(str, enum.Enum):
    available = "available"
    assigned = "assigned"
    in_use = "in_use"
    maintenance = "maintenance"
    returned = "returned"
    retired = "retired"
    return_requested = "return_requested"

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    role = Column(String, default=RoleEnum.employee)
    status = Column(String, default="active")
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    assets = relationship("Asset", back_populates="assigned_user")
    histories = relationship("AssetHistory", foreign_keys="[AssetHistory.performed_by_id]", back_populates="user")


class Asset(Base):
    __tablename__ = "assets"

    id = Column(Integer, primary_key=True, index=True)
    asset_name = Column(String, index=True)
    category = Column(String, index=True)
    purchase_date = Column(Date)
    cost = Column(Float)
    status = Column(String, default=AssetStatusEnum.available)
    assigned_user_id = Column(Integer, ForeignKey("users.id"), nullable=True)

    # Relationships
    assigned_user = relationship("User", back_populates="assets")
    histories = relationship("AssetHistory", back_populates="asset")


class AssetHistory(Base):
    __tablename__ = "asset_history"

    id = Column(Integer, primary_key=True, index=True)
    asset_id = Column(Integer, ForeignKey("assets.id"))
    action = Column(String) # e.g., "Assigned", "Returned", "Maintenance"
    date = Column(DateTime, default=datetime.utcnow)
    performed_by_id = Column(Integer, ForeignKey("users.id")) # user who performed the action
    target_user_id = Column(Integer, ForeignKey("users.id"), nullable=True) # user the action affected

    # Relationships
    asset = relationship("Asset", back_populates="histories")
    user = relationship("User", foreign_keys=[performed_by_id], back_populates="histories")
    target_user = relationship("User", foreign_keys=[target_user_id])


class TicketStatusEnum(str, enum.Enum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    resolved = "resolved"

class Ticket(Base):
    __tablename__ = "tickets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    asset_id = Column(Integer, ForeignKey("assets.id"), nullable=True)
    request_type = Column(String) # e.g., "maintenance", "new_asset"
    description = Column(String)
    status = Column(String, default=TicketStatusEnum.pending)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)

    # Relationships
    user = relationship("User")
    asset = relationship("Asset")
