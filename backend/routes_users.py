from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import Optional
from pydantic import EmailStr

from database_connection import get_db_dependency
from models import User
from schemas import UserCreate, UserResponse

router = APIRouter(prefix="/api/users", tags=["users"])


@router.post("", response_model=UserResponse, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate, db: Session = Depends(get_db_dependency)):
    # Check duplicate email
    existing = db.query(User).filter(User.email == payload.email).first()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Email already registered")

    # Temporarily store raw password (to be replaced with hashing later)
    user = User(
        email=payload.email,
        password_hash=payload.password,  # NOTE: plain text storage (temporary)
        first_name=payload.first_name,
        last_name=payload.last_name,
        role=payload.role or 'member',
        avatar_url=payload.avatar_url,
        is_active=True,
        email_verified=False,
    )

    db.add(user)
    try:
        db.commit()
    except Exception:
        db.rollback()
        raise HTTPException(status_code=500, detail="Failed to create user")
    db.refresh(user)
    return user


@router.get("/login", response_model=UserResponse)
def login_user(email: EmailStr, password: str, db: Session = Depends(get_db_dependency)):
    """
    Temporary login via GET with query params (?email=...&password=...)
    Returns user if email & password match exactly.
    """
    user = db.query(User).filter(User.email == email).first()
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    if user.password_hash != password:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")

    if not user.is_active:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="User is inactive")

    return user
