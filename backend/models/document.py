"""
Document models for file uploads and text extraction.
"""
from sqlalchemy import Column, String, BigInteger, DateTime, ForeignKey, Text, Integer, text
from sqlalchemy.orm import relationship
from .base import Base


class Document(Base):
    __tablename__ = 'documents'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    file_name = Column(String(255), nullable=False)
    file_path = Column(String(500), nullable=False)
    file_size = Column(BigInteger, nullable=False)
    mime_type = Column(String(100), nullable=True)
    project_id = Column(BigInteger, ForeignKey('projects.id'), nullable=True)
    uploaded_by = Column(BigInteger, ForeignKey('users.id'), nullable=True)
    is_processed = Column(Integer, nullable=False, server_default=text('0'))
    extracted_text = Column(Text, nullable=True)
    text_extracted_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    # Relationships
    project = relationship("Project", backref="documents")
    uploader = relationship("User", foreign_keys=[uploaded_by])

