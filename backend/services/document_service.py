"""
Document Service - Business logic for document management.
Handles all document-related operations, validation, and file handling.
"""
from sqlalchemy.orm import Session
from typing import Optional, List
from pathlib import Path
import uuid
from fastapi import HTTPException, status, UploadFile

from models.document import Document
from models.project import Project
from models.user import User
from schemas.document import DocumentResponse, DocumentUpdate


class DocumentService:
    """Service class for document business logic"""
    
    # Configuration
    UPLOAD_DIR = Path("uploads/documents")
    MAX_FILE_SIZE = 200 * 1024 * 1024  # 200MB
    ALLOWED_EXTENSIONS = {'.pdf', '.doc', '.docx'}
    ALLOWED_MIME_TYPES = {
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-word'
    }
    
    @staticmethod
    def validate_file(file: UploadFile) -> None:
        """Validate file type and size"""
        # Check file extension
        file_ext = Path(file.filename).suffix.lower()
        if file_ext not in DocumentService.ALLOWED_EXTENSIONS:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid file type. Allowed: {', '.join(DocumentService.ALLOWED_EXTENSIONS)}"
            )
        
        # Check MIME type if provided
        if file.content_type and file.content_type not in DocumentService.ALLOWED_MIME_TYPES:
            if file_ext not in DocumentService.ALLOWED_EXTENSIONS:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail="Invalid file type. Please upload PDF or Word documents only."
                )
    
    @staticmethod
    def validate_file_size(file_size: int) -> None:
        """Validate file size"""
        if file_size > DocumentService.MAX_FILE_SIZE:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"File size exceeds maximum limit of {DocumentService.MAX_FILE_SIZE / (1024*1024):.0f}MB"
            )
    
    @staticmethod
    def validate_project(project_id: int, db: Session) -> Project:
        """Validate project exists and return it"""
        project = db.query(Project).filter(Project.id == project_id).first()
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        return project
    
    @staticmethod
    def build_document_response(document: Document, db: Session) -> DocumentResponse:
        """Build DocumentResponse with relationships"""
        uploaded_by_name = None
        if document.uploaded_by:
            user = db.query(User).filter(User.id == document.uploaded_by).first()
            if user:
                uploaded_by_name = f"{user.first_name} {user.last_name}".strip()
        
        return DocumentResponse(
            id=document.id,
            title=document.title,
            description=document.description,
            file_name=document.file_name,
            file_path=document.file_path,
            file_size=document.file_size,
            mime_type=document.mime_type,
            project_id=document.project_id,
            uploaded_by=document.uploaded_by,
            uploaded_by_name=uploaded_by_name,
            is_processed=bool(document.is_processed),
            extracted_text=document.extracted_text,
            text_extracted_at=document.text_extracted_at,
            created_at=document.created_at,
            updated_at=document.updated_at
        )
    
    @staticmethod
    def get_document_by_id(document_id: int, db: Session) -> Document:
        """Get a document by ID, raising HTTPException if not found"""
        document = db.query(Document).filter(Document.id == document_id).first()
        if not document:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Document not found"
            )
        return document
    
    @staticmethod
    def list_project_documents(project_id: int, db: Session) -> List[Document]:
        """List all documents for a project"""
        DocumentService.validate_project(project_id, db)
        return db.query(Document).filter(
            Document.project_id == project_id
        ).order_by(Document.created_at.desc()).all()
    
    @staticmethod
    async def save_uploaded_file(
        file: UploadFile,
        project_id: int,
        file_content: bytes
    ) -> tuple[str, str]:
        """Save uploaded file to disk and return (file_path, original_filename)"""
        # Generate unique filename
        file_ext = Path(file.filename).suffix
        unique_filename = f"{uuid.uuid4()}{file_ext}"
        
        # Create project-specific directory
        project_dir = DocumentService.UPLOAD_DIR / str(project_id)
        project_dir.mkdir(parents=True, exist_ok=True)
        
        # Full file path
        file_path = project_dir / unique_filename
        
        # Write file content
        with open(file_path, "wb") as buffer:
            buffer.write(file_content)
        
        # Get absolute path for storage
        absolute_path = str(file_path.absolute())
        original_filename = file.filename
        
        return absolute_path, original_filename
    
    @staticmethod
    async def upload_document(
        project_id: int,
        file: UploadFile,
        title: Optional[str],
        description: Optional[str],
        uploaded_by: Optional[int],
        db: Session
    ) -> Document:
        """Upload a document for a project"""
        # Validate project
        DocumentService.validate_project(project_id, db)
        
        # Validate file
        DocumentService.validate_file(file)
        
        # Read file content
        file_content = await file.read()
        file_size = len(file_content)
        
        # Validate file size
        DocumentService.validate_file_size(file_size)
        
        # Save file
        try:
            absolute_path, original_filename = await DocumentService.save_uploaded_file(
                file, project_id, file_content
            )
        except Exception as e:
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to save file: {str(e)}"
            )
        
        # Create document record
        document_title = title or Path(original_filename).stem
        
        document = Document(
            title=document_title,
            description=description,
            file_name=original_filename,
            file_path=absolute_path,
            file_size=file_size,
            mime_type=file.content_type,
            project_id=project_id,
            uploaded_by=uploaded_by,
            is_processed=0
        )
        
        db.add(document)
        try:
            db.commit()
            db.refresh(document)
        except Exception as e:
            db.rollback()
            # Clean up file if DB insert fails
            try:
                Path(absolute_path).unlink()
            except:
                pass
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail=f"Failed to create document record: {str(e)}"
            )
        
        return document
    
    @staticmethod
    def update_document(document_id: int, payload: DocumentUpdate, db: Session) -> Document:
        """Update document metadata"""
        document = DocumentService.get_document_by_id(document_id, db)
        
        if payload.title is not None:
            document.title = payload.title
        if payload.description is not None:
            document.description = payload.description
        
        db.commit()
        db.refresh(document)
        return document
    
    @staticmethod
    def delete_document(document_id: int, db: Session) -> None:
        """Delete a document and its file"""
        document = DocumentService.get_document_by_id(document_id, db)
        
        # Delete physical file
        try:
            if document.file_path:
                file_path = Path(document.file_path)
                if file_path.exists() and file_path.is_file():
                    file_path.unlink()
        except Exception as e:
            # Log error but continue with DB deletion
            import logging
            logging.warning(f"Failed to delete file {document.file_path}: {e}")
        
        # Delete from database
        db.delete(document)
        db.commit()

