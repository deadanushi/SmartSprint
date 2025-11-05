"""
Schemas package - Pydantic models for request/response validation.
Organized by resource for better maintainability.
"""

# User schemas
from .user import (
    UserCreate,
    UserResponse,
    UserUpdate,
    UserDetailResponse,
)

# Role schemas
from .role import (
    RoleResponse,
    RoleUpdate,
)

# Permission schemas
from .permission import (
    PermissionResponse,
    RolePermissionsResponse,
    RolePermissionsUpdate,
    UserPermissionDetail,
    UserPermissionsResponse,
    UserPermissionUpdate,
)

# Task schemas
from .task import (
    TaskCreate,
    TaskUpdate,
    TaskResponse,
    TaskAssigneeResponse,
    TaskLinkResponse,
)

# Project schemas
from .project import (
    ProjectCreate,
    ProjectUpdate,
    ProjectResponse,
)

# Document schemas
from .document import (
    DocumentCreate,
    DocumentUpdate,
    DocumentResponse,
)

__all__ = [
    # User
    'UserCreate',
    'UserResponse',
    'UserUpdate',
    'UserDetailResponse',
    # Role
    'RoleResponse',
    'RoleUpdate',
    # Permission
    'PermissionResponse',
    'RolePermissionsResponse',
    'RolePermissionsUpdate',
    'UserPermissionDetail',
    'UserPermissionsResponse',
    'UserPermissionUpdate',
    # Task
    'TaskCreate',
    'TaskUpdate',
    'TaskResponse',
    'TaskAssigneeResponse',
    'TaskLinkResponse',
    # Project
    'ProjectCreate',
    'ProjectUpdate',
    'ProjectResponse',
    # Document
    'DocumentCreate',
    'DocumentUpdate',
    'DocumentResponse',
]

