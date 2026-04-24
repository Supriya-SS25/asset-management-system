"""
Assignment Management Router

This module contains all assignment-related API endpoints including
asset assignment, retrieval, and return operations.
"""

from fastapi import APIRouter, HTTPException
from typing import List
from models.assignment import AssignmentCreate, AssignmentResponse, AssignmentUpdate

router = APIRouter(prefix="/api/assignments", tags=["assignments"])

# Mock database - in production, this would be replaced with actual database operations
mock_assignments = []
assignment_id_counter = 1

@router.post("/", response_model=AssignmentResponse, status_code=201)
async def create_assignment(assignment: AssignmentCreate):
    """
    Assign an asset to an employee.
    
    Args:
        assignment: AssignmentCreate model with user_id, asset_id, assigned_date, and due_date
        
    Returns:
        AssignmentResponse: Created assignment with ID and status
        
    Raises:
        HTTPException: If asset already assigned or user not found
    """
    global assignment_id_counter
    
    # Check if asset is already assigned
    for existing_assignment in mock_assignments:
        if existing_assignment["asset_id"] == assignment.asset_id and existing_assignment["status"] == "assigned":
            raise HTTPException(status_code=400, detail="Asset already assigned")
    
    # Create new assignment
    new_assignment = {
        "id": assignment_id_counter,
        "user_id": assignment.user_id,
        "asset_id": assignment.asset_id,
        "assigned_date": assignment.assigned_date.isoformat(),
        "due_date": assignment.due_date.isoformat(),
        "returned_date": None,
        "status": "assigned"
    }
    
    mock_assignments.append(new_assignment)
    assignment_id_counter += 1
    
    return new_assignment

@router.get("/{user_id}/assignments", response_model=List[AssignmentResponse])
async def get_user_assignments(user_id: int):
    """
    View employee asset history.
    
    Args:
        user_id: Unique identifier of the user
        
    Returns:
        List[AssignmentResponse]: List of user's assignments
        
    Raises:
        HTTPException: If user not found
    """
    user_assignments = []
    for assignment in mock_assignments:
        if assignment["user_id"] == user_id:
            user_assignments.append(assignment)
    
    return user_assignments

@router.get("/assets/{asset_id}/assignments", response_model=List[AssignmentResponse])
async def get_asset_assignments(asset_id: int):
    """
    View asset assignment history.
    
    Args:
        asset_id: Unique identifier of the asset
        
    Returns:
        List[AssignmentResponse]: List of asset's assignments
        
    Raises:
        HTTPException: If asset not found
    """
    asset_assignments = []
    for assignment in mock_assignments:
        if assignment["asset_id"] == asset_id:
            asset_assignments.append(assignment)
    
    return asset_assignments

@router.put("/{assignment_id}", response_model=AssignmentResponse)
async def update_assignment(assignment_id: int, assignment_update: AssignmentUpdate):
    """
    Return asset from employee.
    
    Args:
        assignment_id: Unique identifier of the assignment
        assignment_update: AssignmentUpdate model with return_date and return_condition
        
    Returns:
        AssignmentResponse: Updated assignment details
        
    Raises:
        HTTPException: If assignment not found
    """
    for assignment in mock_assignments:
        if assignment["id"] == assignment_id:
            # Update return information
            if assignment_update.returned_date is not None:
                assignment["returned_date"] = assignment_update.returned_date.isoformat()
                assignment["status"] = "returned"
            
            if assignment_update.return_condition is not None:
                assignment["return_condition"] = assignment_update.return_condition
            
            return assignment
    
    raise HTTPException(status_code=404, detail="Assignment not found")
