"""
Pydantic models for Department Management API.

This module contains data validation models for department-related endpoints
including department creation, response formats, and field validation.
"""

from pydantic import BaseModel
from typing import Optional
from datetime import datetime

class DepartmentCreate(BaseModel):
    """
    Pydantic model for creating a new department.
    
    Required Fields:
        name: Department name
        description: Department description
    """
    name: str
    description: str

class DepartmentResponse(BaseModel):
    """
    Pydantic model for department response data.
    
    Fields:
        id: Unique department identifier
        name: Department name
        description: Department description
        created_at: Department creation timestamp
    """
    id: int
    name: str
    description: str
    created_at: datetime

class DepartmentUpdate(BaseModel):
    """
    Pydantic model for updating department information.
    
    Optional Fields:
        name: Department name
        description: Department description
    """
    name: Optional[str] = None
    description: Optional[str] = None
