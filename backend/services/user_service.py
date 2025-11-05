from sqlalchemy.orm import Session, joinedload
from typing import Optional, List
from fastapi import HTTPException, status
from pydantic import EmailStr

from models.user import User
from models.role import Role
from models.company import Company
from schemas.user import UserCreate, UserUpdate, UserResponse, UserDetailResponse


class UserService:    
    @staticmethod
    def validate_email_not_exists(email: str, db: Session, exclude_user_id: Optional[int] = None) -> None:
        query = db.query(User).filter(User.email == email)
        if exclude_user_id:
            query = query.filter(User.id != exclude_user_id)
        existing = query.first()
        if existing:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail="Email already registered" if not exclude_user_id else "Email already in use"
            )
    
    @staticmethod
    def get_role_by_key(role_key: str, db: Session, default_key: str = 'other') -> Role:
        role = db.query(Role).filter(Role.role_key == role_key).first()
        if not role:
            role = db.query(Role).filter(Role.role_key == default_key).first()
            if not role:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Role '{role_key}' not found and default role '{default_key}' also not found"
                )
        return role
    
    @staticmethod
    def get_user_by_id(user_id: int, db: Session) -> User:
        user = db.query(User).options(joinedload(User.role)).filter(User.id == user_id).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    
    @staticmethod
    def get_user_by_email(email: str, db: Session) -> User:
        user = db.query(User).options(joinedload(User.role)).filter(User.email == email).first()
        if not user:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="User not found"
            )
        return user
    
    @staticmethod
    def list_users(
        db: Session,
        skip: int = 0,
        limit: int = 100,
        is_active: Optional[bool] = None,
        role_key: Optional[str] = None
    ) -> List[User]:
        query = db.query(User).options(joinedload(User.role))
        
        if is_active is not None:
            query = query.filter(User.is_active == is_active)
        
        if role_key:
            role = db.query(Role).filter(Role.role_key == role_key).first()
            if role:
                query = query.filter(User.role_id == role.id)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def build_user_response(user: User) -> UserResponse:
        role_key = user.role.role_key if user.role else 'other'
        role_name = user.role.name if user.role else None
        
        return UserResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            role=role_key,
            role_name=role_name,
            company_id=user.company_id,
            company_name=user.company.name if user.company else None,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            email_verified=user.email_verified,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
    
    @staticmethod
    def build_user_detail_response(user: User, db: Session) -> UserDetailResponse:
        role_key = user.role.role_key if user.role else None
        role_name = user.role.name if user.role else None
        
        return UserDetailResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            role_key=role_key,
            role_name=role_name,
            avatar_url=user.avatar_url,
            company_id=user.company_id,
            is_active=user.is_active,
            email_verified=user.email_verified,
            last_login=user.last_login,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
    
    @staticmethod
    def build_user_response_with_company(user: User, db: Session) -> UserResponse:  
        role_key = user.role.role_key if user.role else 'other'
        role_name = user.role.name if user.role else None
        
        company_name = None
        if user.company_id:
            company = db.query(Company).filter(Company.id == user.company_id).first()
            company_name = company.name if company else None
        
        return UserResponse(
            id=user.id,
            email=user.email,
            first_name=user.first_name,
            last_name=user.last_name,
            role=role_key,
            role_name=role_name,
            company_id=user.company_id,
            company_name=company_name,
            avatar_url=user.avatar_url,
            is_active=user.is_active,
            email_verified=user.email_verified,
            created_at=user.created_at,
            updated_at=user.updated_at
        )
    
    @staticmethod
    def create_user(payload: UserCreate, db: Session) -> User:
        # Validate email uniqueness
        UserService.validate_email_not_exists(payload.email, db)
        
        # Get role
        role_key = payload.role or 'other'
        role = UserService.get_role_by_key(role_key, db)
        
        user = User(
            email=payload.email,
            password_hash=payload.password,  # TODO: Hash password
            first_name=payload.first_name,
            last_name=payload.last_name,
            role_id=role.id,
            avatar_url=payload.avatar_url,
            is_active=True,
            email_verified=False,
        )
        
        db.add(user)
        db.commit()
        db.refresh(user)
        
        return db.query(User).options(joinedload(User.role)).filter(User.id == user.id).first()
    
    @staticmethod
    def authenticate_user(email: str, password: str, db: Session) -> User:
        user = UserService.get_user_by_email(email, db)
        
        if user.password_hash != password:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials"
            )
        
        if not user.is_active:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="User is inactive"
            )
        
        return user
    
    @staticmethod
    def update_user(user_id: int, payload: UserUpdate, db: Session) -> User:
        user = UserService.get_user_by_id(user_id, db)
        
        if payload.first_name is not None:
            user.first_name = payload.first_name
        if payload.last_name is not None:
            user.last_name = payload.last_name
        if payload.email is not None:
            UserService.validate_email_not_exists(payload.email, db, exclude_user_id=user_id)
            user.email = payload.email
        if payload.avatar_url is not None:
            user.avatar_url = payload.avatar_url
        if payload.is_active is not None:
            user.is_active = payload.is_active
        if payload.email_verified is not None:
            user.email_verified = payload.email_verified
        
        # Update role
        if payload.role is not None:
            role = UserService.get_role_by_key(payload.role, db)
            user.role_id = role.id
        
        db.commit()
        db.refresh(user)
        
        return db.query(User).options(joinedload(User.role)).filter(User.id == user_id).first()

