"""
Task schemas for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class TaskCreate(BaseModel):
    title: str = Field(min_length=1, max_length=500)
    description: Optional[str] = None
    project_id: Optional[int] = None
    sprint_id: Optional[int] = None
    status_key: Optional[str] = None  # task_status.key (e.g., 'to-do', 'in-progress')
    priority_key: Optional[str] = None  # task_priority.key (e.g., 'low', 'medium', 'high')
    task_type_key: Optional[str] = None  # task_type.key (e.g., 'frontend', 'backend')
    assignee_ids: Optional[List[int]] = []  # List of user IDs to assign
    reviewer_id: Optional[int] = None
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    progress_percentage: Optional[int] = Field(default=0, ge=0, le=100)
    created_by: Optional[int] = None


class TaskAssigneeResponse(BaseModel):
    id: int
    user_id: int
    user_name: Optional[str] = None
    user_email: Optional[str] = None
    assigned_at: datetime

    class Config:
        from_attributes = True


class TaskLinkResponse(BaseModel):
    id: int
    url: str
    title: Optional[str] = None
    description: Optional[str] = None
    link_type: str
    created_at: datetime

    class Config:
        from_attributes = True


class TaskResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    project_id: Optional[int] = None
    project_name: Optional[str] = None
    sprint_id: Optional[int] = None
    sprint_name: Optional[str] = None
    status_key: Optional[str] = None
    status_name: Optional[str] = None
    priority_key: Optional[str] = None
    priority_name: Optional[str] = None
    task_type_key: Optional[str] = None
    task_type_name: Optional[str] = None
    assignee_id: Optional[int] = None  # Primary assignee (legacy field)
    reviewer_id: Optional[int] = None
    reviewer_name: Optional[str] = None
    assignees: List[TaskAssigneeResponse] = []
    links_count: int = 0
    comments_count: int = 0
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    progress_percentage: int = 0
    created_by: Optional[int] = None
    creator_name: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class TaskUpdate(BaseModel):
    title: Optional[str] = Field(default=None, min_length=1, max_length=500)
    description: Optional[str] = None
    project_id: Optional[int] = None
    sprint_id: Optional[int] = None
    status_key: Optional[str] = None
    priority_key: Optional[str] = None
    task_type_key: Optional[str] = None
    assignee_ids: Optional[List[int]] = None  # Will replace all assignees
    reviewer_id: Optional[int] = None
    due_date: Optional[datetime] = None
    estimated_hours: Optional[float] = None
    actual_hours: Optional[float] = None
    progress_percentage: Optional[int] = Field(default=None, ge=0, le=100)

