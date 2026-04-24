"""
Department Management Router

This module contains all department-related API endpoints including
department creation, retrieval, and update operations.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from models.department import DepartmentCreate, DepartmentResponse, DepartmentUpdate

router = APIRouter(prefix="/api/departments", tags=["departments"])

# Mock database - in production, this would be replaced with actual database operations
mock_departments = []
department_id_counter = 1

@router.post("/", response_model=DepartmentResponse, status_code=201)
async def create_department(department: DepartmentCreate):
    """
    Add a new department to the system.
    
    Args:
        department: DepartmentCreate model with name and description
        
    Returns:
        DepartmentResponse: Created department with ID and timestamp
        
    Raises:
        HTTPException: If department name already exists
    """
    global department_id_counter
    
    # Check if department name already exists
    for existing_department in mock_departments:
        if existing_department["name"] == department.name:
            raise HTTPException(status_code=400, detail="Department name already exists")
    
    # Create new department
    new_department = {
        "id": department_id_counter,
        "name": department.name,
        "description": department.description,
        "created_at": "2024-01-01T00:00:00"  # Mock timestamp
    }
    
    mock_departments.append(new_department)
    department_id_counter += 1
    
    return new_department

@router.get("/", response_model=List[DepartmentResponse])
async def get_all_departments():
    """
    View all departments in the system.
    
    Returns:
        List[DepartmentResponse]: List of all departments with their details
    """
    return mock_departments

@router.get("/{department_id}", response_model=DepartmentResponse)
async def get_department_by_id(department_id: int):
    """
    View a single department by ID.
    
    Args:
        department_id: Unique identifier of the department
        
    Returns:
        DepartmentResponse: Department details
        
    Raises:
        HTTPException: If department not found
    """
    for department in mock_departments:
        if department["id"] == department_id:
            return department
    
    raise HTTPException(status_code=404, detail="Department not found")

@router.put("/{department_id}", response_model=DepartmentResponse)
async def update_department(department_id: int, department_update: DepartmentUpdate):
    """
    Update department details.
    
    Args:
        department_id: Unique identifier of the department
        department_update: DepartmentUpdate model with fields to update
        
    Returns:
        DepartmentResponse: Updated department details
        
    Raises:
        HTTPException: If department not found
    """
    for department in mock_departments:
        if department["id"] == department_id:
            # Update only provided fields
            if department_update.name is not None:
                department["name"] = department_update.name
            if department_update.description is not None:
                department["description"] = department_update.description
            
            return department
    
    raise HTTPException(status_code=404, detail="Department not found")
