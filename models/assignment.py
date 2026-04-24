"""
Pydantic models for Assignment Management API.

This module contains data validation models for assignment-related endpoints
including asset assignment, response formats, and field validation.
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class AssignmentCreate(BaseModel):
    """
    Pydantic model for creating a new asset assignment.
    
    Required Fields:
        user_id: ID of user receiving asset
        asset_id: ID of asset being assigned
        assigned_date: Date of assignment
        due_date: Due date for return
    """
    user_id: int
    asset_id: int
    assigned_date: datetime
    due_date: datetime

class AssignmentResponse(BaseModel):
    """
    Pydantic model for assignment response data.
    
    Fields:
        id: Unique assignment identifier
        user_id: ID of user receiving asset
        asset_id: ID of assigned asset
        assigned_date: Date of assignment
        due_date: Due date for return
        returned_date: Date of return (optional)
        status: Current assignment status
    """
    id: int
    user_id: int
    asset_id: int
    assigned_date: datetime
    due_date: datetime
    returned_date: Optional[datetime] = None
    status: str

class AssignmentUpdate(BaseModel):
    """
    Pydantic model for updating assignment information.
    
    Optional Fields:
        returned_date: Date of return
        return_condition: Asset condition when returned
    """
    returned_date: Optional[datetime] = None
    return_condition: Optional[str] = None
