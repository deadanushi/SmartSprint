"""
Role schemas for request/response validation.
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class RoleResponse(BaseModel):
    id: int
    role_key: str
    name: str
    created_at: datetime

    class Config:
        from_attributes = True


class RoleUpdate(BaseModel):
    name: Optional[str] = None

