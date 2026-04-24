from fastapi import APIRouter, Depends
from dependencies.rbac import get_current_user, RequirePrivilege
from models.user_db import User

router = APIRouter(prefix="/api/test", tags=["test"])

@router.get("/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """
    Test endpoint to get current user info and permissions
    """
    return {
        "user_id": current_user.id,
        "name": current_user.full_name,
        "email": current_user.email,
        "role": current_user.role.name if current_user.role else None,
        "permissions": [perm.name for perm in current_user.permissions]
    }

@router.get("/admin-only")
async def admin_only_endpoint(current_user: User = Depends(RequirePrivilege('delete:user'))):
    """
    Test endpoint that requires admin permission
    """
    return {
        "message": "Welcome admin! You have access to this endpoint.",
        "user": current_user.full_name
    }

@router.get("/employee-only")
async def employee_only_endpoint(current_user: User = Depends(RequirePrivilege('view:my_gear'))):
    """
    Test endpoint that requires employee permission
    """
    return {
        "message": "Welcome employee! You can view your gear.",
        "user": current_user.full_name
    }
