"""
Permissions API routes - manage permissions in the system.
"""
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List

from database_connection import get_db_dependency
from models import Permission
from schemas import PermissionResponse

router = APIRouter(prefix="/api/permissions", tags=["permissions"])


@router.get("", response_model=List[PermissionResponse])
def list_permissions(
    category: Optional[str] = None,
    db: Session = Depends(get_db_dependency)
):
    """
    Get all permissions, optionally filtered by category.
    """
    query = db.query(Permission)
    if category:
        query = query.filter(Permission.category == category)
    
    permissions = query.order_by(Permission.category.asc(), Permission.name.asc()).all()
    return permissions


@router.get("/{permission_id}", response_model=PermissionResponse)
def get_permission(permission_id: int, db: Session = Depends(get_db_dependency)):
    """
    Get a specific permission by ID.
    """
    permission = db.query(Permission).filter(Permission.id == permission_id).first()
    if not permission:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Permission not found"
        )
    return permission

