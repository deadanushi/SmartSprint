"""
User Permissions API routes - manage explicit permissions for users.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database_connection import get_db_dependency
from models import User, Role, Permission, RoleHasPermission, UserPermission
from schemas import UserPermissionsResponse, UserPermissionDetail, UserPermissionUpdate

router = APIRouter(prefix="/api/users", tags=["user-permissions"])


@router.get("/{user_id}/permissions", response_model=UserPermissionsResponse)
def get_user_permissions(user_id: int, db: Session = Depends(get_db_dependency)):
    """
    Get all permissions for a user, including:
    - Permissions from their role
    - Explicit permissions granted/denied
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    role_permissions = []
    if user.role_id:
        # Get permissions from role
        role_permission_ids = db.query(RoleHasPermission.permission_id).filter(
            RoleHasPermission.role_id == user.role_id
        ).all()
        permission_ids = [p[0] for p in role_permission_ids]
        
        permissions = db.query(Permission).filter(
            Permission.id.in_(permission_ids)
        ).all()
        
        role_permissions = [
            UserPermissionDetail(
                permission_key=perm.perm_key,
                permission_name=perm.name,
                category=perm.category,
                granted=True,
                source='role'
            )
            for perm in permissions
        ]
    
    # Get explicit user permissions
    user_perms = db.query(UserPermission).filter(
        UserPermission.user_id == user_id
    ).all()
    
    # Get permission details for explicit permissions
    explicit_permission_keys = [up.permission_key for up in user_perms]
    explicit_perms_detail = db.query(Permission).filter(
        Permission.perm_key.in_(explicit_permission_keys)
    ).all()
    
    perm_key_to_detail = {p.perm_key: p for p in explicit_perms_detail}
    
    explicit_permissions = []
    for up in user_perms:
        perm_detail = perm_key_to_detail.get(up.permission_key)
        if perm_detail:
            explicit_permissions.append(
                UserPermissionDetail(
                    permission_key=up.permission_key,
                    permission_name=perm_detail.name,
                    category=perm_detail.category,
                    granted=up.granted,
                    source='explicit'
                )
            )
        else:
            # If permission doesn't exist in permissions table, still show it
            explicit_permissions.append(
                UserPermissionDetail(
                    permission_key=up.permission_key,
                    permission_name=up.permission_key,
                    category='unknown',
                    granted=up.granted,
                    source='explicit'
                )
            )
    
    return UserPermissionsResponse(
        user_id=user.id,
        role_permissions=role_permissions,
        explicit_permissions=explicit_permissions
    )


@router.put("/{user_id}/permissions/{permission_key}", response_model=UserPermissionsResponse)
def update_user_permission(
    user_id: int,
    permission_key: str,
    payload: UserPermissionUpdate,
    db: Session = Depends(get_db_dependency),
    granted_by: int = 1  # TODO: Get from auth token
):
    """
    Update an explicit permission for a user.
    Creates or updates the user_permissions record.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Verify permission exists
    permission = db.query(Permission).filter(Permission.perm_key == permission_key).first()
    if not permission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Permission '{permission_key}' not found"
        )
    
    # Find or create user permission
    user_permission = db.query(UserPermission).filter(
        UserPermission.user_id == user_id,
        UserPermission.permission_key == permission_key
    ).first()
    
    if user_permission:
        user_permission.granted = payload.granted
        user_permission.granted_by = granted_by
    else:
        user_permission = UserPermission(
            user_id=user_id,
            permission_key=permission_key,
            granted=payload.granted,
            granted_by=granted_by
        )
        db.add(user_permission)
    
    try:
        db.commit()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user permission: {str(e)}"
        )
    
    return get_user_permissions(user_id, db)


@router.delete("/{user_id}/permissions/{permission_key}", response_model=UserPermissionsResponse)
def delete_user_permission(
    user_id: int,
    permission_key: str,
    db: Session = Depends(get_db_dependency)
):
    """
    Remove an explicit permission override for a user.
    The user will fall back to their role's permissions.
    """
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    user_permission = db.query(UserPermission).filter(
        UserPermission.user_id == user_id,
        UserPermission.permission_key == permission_key
    ).first()
    
    if user_permission:
        db.delete(user_permission)
        try:
            db.commit()
        except Exception as e:
            db.rollback()
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to delete user permission: {str(e)}"
            )
    
    return get_user_permissions(user_id, db)

