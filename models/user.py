"""
Pydantic models for User Management API.

This module contains data validation models for user-related endpoints
including user creation, response formats, and field validation.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import datetime

class UserCreate(BaseModel):
    """
    Pydantic model for creating a new user.
    
    Required Fields:
        name: User's full name
        email: User's email address (validated)
        role: User's role in the system
        department_id: Department ID the user belongs to
    """
    name: str
    email: EmailStr
    password: Optional[str] = None
    role: str = "employee"
    department_id: int = 1

class UserResponse(BaseModel):
    """
    Pydantic model for user response data.
    
    Fields:
        id: Unique user identifier
        name: User's full name
        email: User's email address
        role: User's role
        department_id: Department ID
        created_at: User creation timestamp
    """
    id: int
    name: str
    email: str
    role: str
    status: str
    department_id: int
    created_at: datetime

class UserUpdate(BaseModel):
    """
    Pydantic model for updating user information.
    
    Optional Fields:
        name: User's full name
        email: User's email address
        role: User's role
        department_id: Department ID
    """
    name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None
    status: Optional[str] = None
    department_id: Optional[int] = None
