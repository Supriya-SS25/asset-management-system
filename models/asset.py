"""
Pydantic models for Asset Management API.

This module contains data validation models for asset-related endpoints
including asset creation, response formats, and field validation.
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AssetCreate(BaseModel):
    """
    Pydantic model for creating a new asset.
    
    Required Fields:
        name: Asset name/description
        serial_number: Unique serial number
        category: Asset category
        status: Current asset status
        purchase_date: Date of purchase
    """
    name: str
    serial_number: str
    category: str
    status: str
    purchase_date: datetime

class AssetResponse(BaseModel):
    """
    Pydantic model for asset response data.
    
    Fields:
        id: Unique asset identifier
        name: Asset name/description
        serial_number: Asset serial number
        category: Asset category
        status: Current asset status
        purchase_date: Date of purchase
        created_at: Asset creation timestamp
    """
    id: int
    name: str
    serial_number: str
    category: str
    status: str
    purchase_date: datetime
    created_at: datetime

class AssetUpdate(BaseModel):
    """
    Pydantic model for updating asset information.
    
    Optional Fields:
        name: Asset name/description
        serial_number: Asset serial number
        category: Asset category
        status: Current asset status
        purchase_date: Date of purchase
    """
    name: Optional[str] = None
    serial_number: Optional[str] = None
    category: Optional[str] = None
    status: Optional[str] = None
    purchase_date: Optional[datetime] = None
