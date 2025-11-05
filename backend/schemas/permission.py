"""
Permission schemas for request/response validation.
Includes role permissions and user permissions.
"""
from pydantic import BaseModel
from typing import List
from datetime import datetime


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

