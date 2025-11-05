from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime


class UserCreate(BaseModel):
    email: EmailStr
    password: str = Field(min_length=1, max_length=255)
    first_name: str = Field(min_length=1, max_length=100)
    last_name: str = Field(min_length=1, max_length=100)
    role: Optional[str] = 'other'  # role_key (e.g., 'admin', 'project-manager')
    avatar_url: Optional[str] = None


class UserResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    role: str  # role_key from Role table
    role_name: Optional[str] = None  # name from Role table
    company_id: Optional[int] = None
    company_name: Optional[str] = None  # name from Company table
    avatar_url: Optional[str]
    is_active: bool
    email_verified: bool
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class UserUpdate(BaseModel):
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    email: Optional[EmailStr] = None
    role: Optional[str] = None  # role_key
    avatar_url: Optional[str] = None
    is_active: Optional[bool] = None
    email_verified: Optional[bool] = None


class UserDetailResponse(BaseModel):
    id: int
    email: EmailStr
    first_name: str
    last_name: str
    role_key: Optional[str] = None
    role_name: Optional[str] = None
    avatar_url: Optional[str]
    company_id: Optional[int] = None
    is_active: bool
    email_verified: bool
    last_login: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

