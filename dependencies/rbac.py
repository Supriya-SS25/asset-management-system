from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Set
from enum import Enum
from database import get_db
from models.user_db import User
from jose import JWTError, jwt
import os

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
security = HTTPBearer()

class UserRole(Enum):
    """User roles with strict hierarchy"""
    ADMIN = "admin"
    MANAGER = "manager"
    EMPLOYEE = "employee"

class Permission(Enum):
    """System permissions"""
    # Asset permissions
    VIEW_OWN_ASSETS = "view_own_assets"
    VIEW_ALL_ASSETS = "view_all_assets"
    CREATE_ASSETS = "create_assets"
    EDIT_ASSETS = "edit_assets"
    DELETE_ASSETS = "delete_assets"
    
    # User permissions
    VIEW_OWN_PROFILE = "view_own_profile"
    EDIT_OWN_PROFILE = "edit_own_profile"
    MANAGE_USERS = "manage_users"
    ASSIGN_ROLES = "assign_roles"
    
    # System permissions
    VIEW_DASHBOARD = "view_dashboard"
    GENERATE_REPORTS = "generate_reports"
    VIEW_AUDIT_LOG = "view_audit_log"

class RolePermissions:
    """Define permissions for each role"""
    
    ROLE_PERMISSIONS = {
        UserRole.EMPLOYEE: {
            Permission.VIEW_OWN_ASSETS,
            Permission.VIEW_OWN_PROFILE,
            Permission.EDIT_OWN_PROFILE,
            Permission.VIEW_DASHBOARD,
        },
        UserRole.MANAGER: {
            Permission.VIEW_OWN_ASSETS,
            Permission.VIEW_ALL_ASSETS,
            Permission.CREATE_ASSETS,
            Permission.EDIT_ASSETS,
            Permission.VIEW_OWN_PROFILE,
            Permission.EDIT_OWN_PROFILE,
            Permission.VIEW_DASHBOARD,
            Permission.GENERATE_REPORTS,
        },
        UserRole.ADMIN: {
            # Admin has ALL permissions
            Permission.VIEW_OWN_ASSETS,
            Permission.VIEW_ALL_ASSETS,
            Permission.CREATE_ASSETS,
            Permission.EDIT_ASSETS,
            Permission.DELETE_ASSETS,
            Permission.VIEW_OWN_PROFILE,
            Permission.EDIT_OWN_PROFILE,
            Permission.MANAGE_USERS,
            Permission.ASSIGN_ROLES,
            Permission.VIEW_DASHBOARD,
            Permission.GENERATE_REPORTS,
            Permission.VIEW_AUDIT_LOG,
        }
    }
    
    @classmethod
    def get_permissions(cls, role: UserRole) -> Set[Permission]:
        """Get all permissions for a role"""
        return cls.ROLE_PERMISSIONS.get(role, set())
    
    @classmethod
    def has_permission(cls, role: UserRole, permission: Permission) -> bool:
        """Check if role has specific permission"""
        return permission in cls.get_permissions(role)

class EmployeeAccessControl:
    """Strict access control for employees - can only access their own data"""
    
    @staticmethod
    def can_access_asset(user_id: int, asset_assigned_to: int) -> bool:
        """Check if employee can access specific asset"""
        # Employees can only access assets assigned to them
        return user_id == asset_assigned_to
    
    @staticmethod
    def filter_employee_assets(user_id: int, all_assets: List[Dict]) -> List[Dict]:
        """Filter assets to show only employee's assigned assets"""
        return [asset for asset in all_assets if asset.get('assigned_to') == user_id]
    
    @staticmethod
    def get_employee_dashboard_data(user_id: int, all_data: Dict) -> Dict:
        """Get dashboard data specific to employee"""
        return {
            'user_assets': EmployeeAccessControl.filter_employee_assets(user_id, all_data.get('assets', [])),
            'user_profile': all_data.get('users', {}).get(str(user_id), {}),
            'personal_stats': {
                'total_assigned_assets': len(EmployeeAccessControl.filter_employee_assets(user_id, all_data.get('assets', []))),
                'active_assignments': len([a for a in EmployeeAccessControl.filter_employee_assets(user_id, all_data.get('assets', [])) if a.get('status') == 'Active']),
            }
        }

def get_current_user(
    credentials: dict = Depends(security),
    db: Session = Depends(get_db)
) -> User:
    """
    Get current user from JWT token
    """
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    user = db.query(User).filter(User.id == user_id).first()
    if user is None:
        raise credentials_exception
    
    if not user.is_active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Inactive user"
        )
    
    return user

def RequirePrivilege(permission: str):
    """
    Dependency factory that requires a specific permission
    Usage: Depends(RequirePrivilege('delete:asset'))
    """
    def privilege_dependency(
        current_user: User = Depends(get_current_user)
    ) -> User:
        if not current_user.has_permission(permission):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied: {permission}"
            )
        return current_user
    
    return privilege_dependency

def RequireAnyPrivilege(permissions: List[str]):
    """
    Dependency factory that requires any of the specified permissions
    Usage: Depends(RequireAnyPrivilege(['delete:asset', 'update:asset']))
    """
    def any_privilege_dependency(
        current_user: User = Depends(get_current_user)
    ) -> User:
        if not any(current_user.has_permission(perm) for perm in permissions):
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Permission denied. Required any of: {', '.join(permissions)}"
            )
        return current_user
    
    return any_privilege_dependency

def RequireRole(role_name: str):
    """
    Dependency factory that requires a specific role
    Usage: Depends(RequireRole('Admin'))
    """
    def role_dependency(
        current_user: User = Depends(get_current_user)
    ) -> User:
        if not current_user.role or current_user.role.name != role_name:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Role denied: {role_name}"
            )
        return current_user
    
    return role_dependency
