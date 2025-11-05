"""
Users API routes - manage users.
Routes handle HTTP concerns only, business logic is in services.
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import EmailStr

from database_connection import get_db_dependency
from services.user_service import UserService
from schemas.user import UserCreate, UserResponse, UserUpdate, UserDetailResponse

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db_dependency)):
    """
    Create a new user.
    """
    try:
        user = UserService.create_user(payload, db)
        role_key = user.role.role_key if user.role else 'other'
        return UserResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            role=role_key,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            email_verified=user.email_verified,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
    except Exception as e:
        db.rollback()
        if isinstance(e, Exception) and hasattr(e, 'status_code'):
            raise e
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create user: {str(e)}"
        )


@router.get("", response_model=List[UserDetailResponse])
def list_users(
    skip: int = 0,
    limit: int = 100,
    is_active: Optional[bool] = None,
    role_key: Optional[str] = None,
    db: Session = Depends(get_db_dependency)
):
    """
    Get all users with optional filtering.
    """
    users = UserService.list_users(
        db=db,
        skip=skip,
        limit=limit,
        is_active=is_active,
        role_key=role_key
    )
    
    return [UserService.build_user_detail_response(user, db) for user in users]


@router.get("/login", response_model=UserResponse)
def login_user(email: EmailStr, password: str, db: Session = Depends(get_db_dependency)):
    """
    Temporary login via GET with query params (?email=...&password=...)
    Returns user if email & password match exactly.
    """
    user = UserService.authenticate_user(email, password, db)
    return UserService.build_user_response_with_company(user, db)


@router.get("/{user_id}", response_model=UserDetailResponse)
def get_user(user_id: int, db: Session = Depends(get_db_dependency)):
    """
    Get a specific user by ID.
    """
    user = UserService.get_user_by_id(user_id, db)
    return UserService.build_user_detail_response(user, db)


@router.patch("/{user_id}", response_model=UserDetailResponse)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db_dependency)
):
    """
    Update a user's information.
    """
    try:
        user = UserService.update_user(user_id, payload, db)
        return UserService.build_user_detail_response(user, db)
    except Exception as e:
        db.rollback()
        if isinstance(e, Exception) and hasattr(e, 'status_code'):
            raise e
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}"
        )
