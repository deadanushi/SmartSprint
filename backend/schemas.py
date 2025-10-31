from pydantic import BaseModel, EmailStr, Field
from typing import Optional, List
from datetime import datetime

# User Schemas
class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=255)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    role: Optional[str] = 'other'  # role_key (e.g., 'admin', 'project-manager')
    avatar_url: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    role: str  # role_key from Role table
    avatar_url: Optional[str]
    is_active: bool
    email_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None  # role_key
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = None
    email_verified: Optional[bool] = None

class UserDetailResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    role_key: Optional[str] = None
    role_name: Optional[str] = None
    avatar_url: Optional[str]
    company_id: Optional[int] = None
    is_active: bool
    email_verified: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

# Role Schemas
class RoleResponse(BaseModel):
    id: int
    role_key: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True

class RoleUpdate(BaseModel):
    name: Optional[str] = None

# Permission Schemas
class PermissionResponse(BaseModel):
    id: int
    perm_key: str
    name: str
    category: str
    created_at: datetime

    class Config:
        from_attributes = True

# Role Permissions Schemas
class RolePermissionsResponse(BaseModel):
    role_id: int
    role_key: str
    role_name: str
    permissions: List[PermissionResponse]

class RolePermissionsUpdate(BaseModel):
    permission_ids: List[int]  # List of permission IDs to assign to the role

# User Permissions Schemas
class UserPermissionDetail(BaseModel):
    permission_key: str
    permission_name: str
    category: str
    granted: bool
    source: str  # 'role' or 'explicit'

class UserPermissionsResponse(BaseModel):
    user_id: int
    role_permissions: List[UserPermissionDetail]
    explicit_permissions: List[UserPermissionDetail]

class UserPermissionUpdate(BaseModel):
    permission_key: str
    granted: bool
