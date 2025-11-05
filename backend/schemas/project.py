"""
Project schemas for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime


class ProjectCreate(BaseModel):
    name: str = Field(min_length=1, max_length=255)
    description: Optional[str] = None
    company_id: Optional[int] = None
    project_manager_id: Optional[int] = None
    status_key: Optional[str] = None  # project_status.key (e.g., 'planning', 'active')
    start_date: Optional[str] = None  # Date as string (YYYY-MM-DD)
    end_date: Optional[str] = None  # Date as string (YYYY-MM-DD)
    budget: Optional[float] = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: Optional[str] = None
    company_id: Optional[int] = None
    company_name: Optional[str] = None
    project_manager_id: Optional[int] = None
    project_manager_name: Optional[str] = None
    status_key: Optional[str] = None
    status_name: Optional[str] = None
    start_date: Optional[str] = None  # Date as string
    end_date: Optional[str] = None  # Date as string
    budget: Optional[float] = None
    tasks_count: int = 0
    sprints_count: int = 0
    members_count: int = 0
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class ProjectUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=255)
    description: Optional[str] = None
    company_id: Optional[int] = None
    project_manager_id: Optional[int] = None
    status_key: Optional[str] = None
    start_date: Optional[str] = None  # Date as string (YYYY-MM-DD)
    end_date: Optional[str] = None  # Date as string (YYYY-MM-DD)
    budget: Optional[float] = None

