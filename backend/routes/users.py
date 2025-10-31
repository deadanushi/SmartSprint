from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional, List
from pydantic import EmailStr

from database_connection import get_db_dependency
from models import User, Role
from schemas import UserCreate, UserResponse, UserUpdate, UserDetailResponse

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db_dependency)):
    # Check duplicate email
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    # Look up role_id from role_key (default to 'other' if not found)
    role_key = payload.role or 'other'
    role = db.query(Role).filter(Role.role_key == role_key).first()
    if not role:
        # If role_key doesn't exist, default to 'other'
        role = db.query(Role).filter(Role.role_key == 'other').first()
        if not role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Role '{role_key}' not found and default role 'other' also not found"
            )

    # Temporarily store raw password (to be replaced with hashing later)
    user = User(
        email=payload.email,
        password_hash=payload.password,  # NOTE: plain text storage (temporary)
        first_name=payload.first_name,
        last_name=payload.last_name,
        role_id=role.id,
        avatar_url=payload.avatar_url,
        is_active=True,
        email_verified=False,
    )

    db.add(user)
    try:
        db.commit()
        db.refresh(user)
    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to create user: {str(e)}")
    
    # Return user with role_key for response
    return UserResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        role=role.role_key,
        avatar_url=user.avatar_url,
        is_active=user.is_active,
        email_verified=user.email_verified,
        created_at=user.created_at,
        updated_at=user.updated_at
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
    from sqlalchemy.orm import joinedload
    
    query = db.query(User).options(joinedload(User.role))
    
    if is_active is not None:
        query = query.filter(User.is_active == is_active)
    
    if role_key:
        role = db.query(Role).filter(Role.role_key == role_key).first()
        if role:
            query = query.filter(User.role_id == role.id)
    
    users = query.offset(skip).limit(limit).all()
    
    return [
        UserDetailResponse(
            id=u.id,
            email=u.email,
            first_name=u.first_name,
            last_name=u.last_name,
            role_key=u.role.role_key if u.role else None,
            role_name=u.role.name if u.role else None,
            avatar_url=u.avatar_url,
            company_id=u.company_id,
            is_active=u.is_active,
            email_verified=u.email_verified,
            last_login=u.last_login,
            created_at=u.created_at,
            updated_at=u.updated_at
        )
        for u in users
    ]


@router.get("/{user_id}", response_model=UserDetailResponse)
def get_user(user_id: int, db: Session = Depends(get_db_dependency)):
    """
    Get a specific user by ID.
    """
    from sqlalchemy.orm import joinedload
    
    user = db.query(User).options(joinedload(User.role)).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    return UserDetailResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        role_key=user.role.role_key if user.role else None,
        role_name=user.role.name if user.role else None,
        avatar_url=user.avatar_url,
        company_id=user.company_id,
        is_active=user.is_active,
        email_verified=user.email_verified,
        last_login=user.last_login,
        created_at=user.created_at,
        updated_at=user.updated_at
    )


@router.patch("/{user_id}", response_model=UserDetailResponse)
def update_user(
    user_id: int,
    payload: UserUpdate,
    db: Session = Depends(get_db_dependency)
):
    """
    Update a user's information.
    """
    from sqlalchemy.orm import joinedload
    
    user = db.query(User).options(joinedload(User.role)).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found"
        )
    
    # Update fields
    if payload.first_name is not None:
        user.first_name = payload.first_name
    if payload.last_name is not None:
        user.last_name = payload.last_name
    if payload.email is not None:
        # Check for duplicate email
        existing = db.query(User).filter(User.email == payload.email, User.id != user_id).first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already in use"
            )
        user.email = payload.email
    if payload.avatar_url is not None:
        user.avatar_url = payload.avatar_url
    if payload.is_active is not None:
        user.is_active = payload.is_active
    if payload.email_verified is not None:
        user.email_verified = payload.email_verified
    
    # Update role if provided
    if payload.role is not None:
        role = db.query(Role).filter(Role.role_key == payload.role).first()
        if not role:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Role '{payload.role}' not found"
            )
        user.role_id = role.id
    
    try:
        db.commit()
        db.refresh(user)
        # Reload with relationship
        user = db.query(User).options(joinedload(User.role)).filter(User.id == user_id).first()
    except Exception as e:
        db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update user: {str(e)}"
        )
    
    return UserDetailResponse(
        id=user.id,
        email=user.email,
        first_name=user.first_name,
        last_name=user.last_name,
        role_key=user.role.role_key if user.role else None,
        role_name=user.role.name if user.role else None,
        avatar_url=user.avatar_url,
        company_id=user.company_id,
        is_active=user.is_active,
        email_verified=user.email_verified,
        last_login=user.last_login,
        created_at=user.created_at,
        updated_at=user.updated_at
    )


@router.get("/login", response_model=UserResponse)
def login_user(email: EmailStr, password: str, db: Session = Depends(get_db_dependency)):
    """
    Temporary login via GET with query params (?email=...&password=...)
    Returns user if email & password match exactly.
    Includes role_key from Role relationship.
    """
    from sqlalchemy.orm import joinedload
    
    user = db.query(User).options(joinedload(User.role)).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.password_hash != password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")

    # Get role_key from relationship (or 'other' as default)
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

