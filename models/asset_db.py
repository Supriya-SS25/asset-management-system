"""
SQLAlchemy Asset Model

This module defines the Asset database model for the asset management system.
"""

from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
from datetime import datetime

class Asset(Base):
    __tablename__ = 'assets'
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    serial_number = Column(String(100), unique=True, nullable=False, index=True)
    category = Column(String(100), nullable=False)
    status = Column(String(50), nullable=False, default='Active')
    location = Column(String(255))
    purchase_date = Column(DateTime)
    purchase_cost = Column(Float)
    assigned_to = Column(Integer, ForeignKey('users.id'))
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    assigned_user = relationship("User", back_populates="assigned_assets")
    maintenance_logs = relationship("MaintenanceLog", back_populates="asset")
    
    def __repr__(self):
        return f"<Asset(id={self.id}, name='{self.name}', serial_number='{self.serial_number}')>"
