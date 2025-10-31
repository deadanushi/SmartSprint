from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from database_connection import get_db_dependency
from models import Role
from schemas import RoleResponse, RoleUpdate

router = APIRouter(prefix="/api/roles", tags=["roles"])


@router.get("", response_model=List[RoleResponse])
def list_roles(db: Session = Depends(get_db_dependency)):
    """
    Get all roles.
    """
    roles = db.query(Role).order_by(Role.name.asc()).all()
    return roles


@router.get("/{role_id}", response_model=RoleResponse)
def get_role(role_id: int, db: Session = Depends(get_db_dependency)):
    """
    Get a specific role by ID.
    """
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    return role


@router.patch("/{role_id}", response_model=RoleResponse)
def update_role(
    role_id: int,
    payload: RoleUpdate,
    db: Session = Depends(get_db_dependency)
):
    """
    Update a role (currently only name can be updated).
    """
    role = db.query(Role).filter(Role.id == role_id).first()
    if not role:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Role not found"
        )
    
    if payload.name is not None:
        role.name = payload.name
    
    try:
        db.commit()
        db.refresh(role)
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update role: {str(e)}"
        )
    
    return role

