"""
Pydantic models for Authentication API.

This module contains data validation models for authentication-related endpoints
including user registration, login, and response formats.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional

class RegisterCreate(BaseModel):
    """
    Pydantic model for user registration.
    
    Required Fields:
        name: User's full name
        email: User's email address
        password: User's password
        role: User's role in the system
    """
    name: str
    email: EmailStr
    password: str
    role: str

class LoginCreate(BaseModel):
    """
    Pydantic model for user login.
    
    Required Fields:
        email: User's email address
        password: User's password
    """
    email: EmailStr
    password: str

class AuthResponse(BaseModel):
    """
    Pydantic model for authentication response data.
    
    Fields:
        id: Unique user identifier
        name: User's full name
        email: User's email address
        role: User's role in the system
        token: Authentication token for session
        message: Success/error message
    """
    id: int
    name: str
    email: str
    role: str
    token: str
    message: str

class LogoutCreate(BaseModel):
    """
    Pydantic model for user logout.
    
    Required Fields:
        token: Authentication token to invalidate
    """
    token: str

class LogoutResponse(BaseModel):
    """
    Pydantic model for logout response data.
    
    Fields:
        message: Success/error message
    """
    message: str
