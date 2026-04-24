from sqlalchemy import Column, Integer, String, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from database import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True, index=True)
    first_name = Column(String(50), nullable=False)
    last_name = Column(String(50), nullable=False)
    email = Column(String(100), unique=True, nullable=False, index=True)
    phone = Column(String(20))
    employee_id = Column(String(20), unique=True)
    department_id = Column(Integer, ForeignKey("departments.id"))
    role_id = Column(Integer, ForeignKey("roles.id"), default=2)  # Default to Employee role
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    department = relationship("Department", back_populates="users")
    role = relationship("Role", back_populates="users")
    asset_assignments = relationship("AssetAssignment", back_populates="user")
    
    @property
    def full_name(self):
        return f"{self.first_name} {self.last_name}"
    
    @property
    def permissions(self):
        """Get user permissions through their role"""
        if self.role:
            return self.role.permissions
        return []
    
    def has_permission(self, permission_name: str) -> bool:
        """Check if user has a specific permission"""
        return any(perm.name == permission_name for perm in self.permissions)
