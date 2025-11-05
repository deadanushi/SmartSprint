"""
Document schemas for request/response validation.
"""
from pydantic import BaseModel
from typing import Optional
from datetime import datetime


class DocumentResponse(BaseModel):
    id: int
    title: str
    description: Optional[str] = None
    file_name: str
    file_path: str
    file_size: int
    mime_type: Optional[str] = None
    project_id: Optional[int] = None
    uploaded_by: Optional[int] = None
    uploaded_by_name: Optional[str] = None
    is_processed: bool
    extracted_text: Optional[str] = None
    text_extracted_at: Optional[datetime] = None
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class DocumentCreate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    project_id: int


class DocumentUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None

