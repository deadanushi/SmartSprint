"""
Role Permissions API routes - manage permissions for roles.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database_connection import get_db_dependency
from models import Role, Permission, RoleHasPermission
from schemas.permission import RolePermissionsResponse, RolePermissionsUpdate, PermissionResponse

router = APIRouter(prefix="/api/roles", tags=["role-permissions"])


@router.get("/{role_id}/permissions", response_model=RolePermissionsResponse)
def get_role_permissions(role_id: int, db: Session = Depends(get_db_dependency)):
    """
    Get all permissions for a specific role.
    """
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    
    # Get permission IDs for this role
    role_permission_ids = db.query(RoleHasPermission.permission_id).filter(
        RoleHasPermission.role_id == role_id
    ).all()
    permission_ids = [p[0] for p in role_permission_ids]
    
    # Get the actual permissions
    permissions = db.query(Permission).filter(
        Permission.id.in_(permission_ids)
    ).order_by(Permission.category.asc(), Permission.name.asc()).all()
    
    return {
        "role_id": role.id,
        "role_key": role.role_key,
        "role_name": role.name,
        "permissions": permissions
    }


@router.put("/{role_id}/permissions", response_model=RolePermissionsResponse)
def update_role_permissions(
    role_id: int,
    payload: RolePermissionsUpdate,
    db: Session = Depends(get_db_dependency)
):
    """
    Update permissions for a role (replaces all existing permissions).
    """
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    
    # Verify all permission IDs exist
    permissions = db.query(Permission).filter(
        Permission.id.in_(payload.permission_ids)
    ).all()
    
    if len(permissions) != len(payload.permission_ids):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="One or more permission IDs not found"
        )
    
    # Delete existing role permissions
    db.query(RoleHasPermission).filter(
        RoleHasPermission.role_id == role_id
    ).delete()
    
    # Add new role permissions
    new_role_permissions = [
        RoleHasPermission(role_id=role_id, permission_id=perm_id)
        for perm_id in payload.permission_ids
    ]
    db.add_all(new_role_permissions)
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update role permissions: {str(e)}"
        )
    
    # Return updated permissions
    return get_role_permissions(role_id, db)

