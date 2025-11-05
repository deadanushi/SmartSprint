"""
Documents API routes - manage document uploads and processing.
Routes handle HTTP concerns only, business logic is in services.
"""
from fastapi import APIRouter, Depends, File, Form, status
from sqlalchemy.orm import Session
from typing import Optional, List
from fastapi import UploadFile

from database_connection import get_db_dependency
from services.document_service import DocumentService
from schemas.document import DocumentResponse, DocumentUpdate

router = APIRouter(prefix="/api", tags=["documents"])


@router.get("/documents/{document_id}", response_model=DocumentResponse)
def get_document(document_id: int, db: Session = Depends(get_db_dependency)):
    """Get a single document by ID"""
    document = DocumentService.get_document_by_id(document_id, db)
    return DocumentService.build_document_response(document, db)


@router.delete("/documents/{document_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_document(document_id: int, db: Session = Depends(get_db_dependency)):
    """Delete a document and its file"""
    try:
        DocumentService.delete_document(document_id, db)
        return None
    except Exception as e:
        db.rollback()
        if isinstance(e, Exception) and hasattr(e, 'status_code'):
            raise e
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete document: {str(e)}"
        )


@router.patch("/documents/{document_id}", response_model=DocumentResponse)
def update_document(
    document_id: int,
    payload: DocumentUpdate,
    db: Session = Depends(get_db_dependency)
):
    """Update document metadata"""
    try:
        document = DocumentService.update_document(document_id, payload, db)
        return DocumentService.build_document_response(document, db)
    except Exception as e:
        db.rollback()
        if isinstance(e, Exception) and hasattr(e, 'status_code'):
            raise e
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update document: {str(e)}"
        )


# Project-specific document endpoints
@router.get("/projects/{project_id}/documents", response_model=List[DocumentResponse])
def get_project_documents(project_id: int, db: Session = Depends(get_db_dependency)):
    """Get all documents for a project"""
    documents = DocumentService.list_project_documents(project_id, db)
    return [DocumentService.build_document_response(doc, db) for doc in documents]


@router.post("/projects/{project_id}/documents/upload", response_model=DocumentResponse, status_code=status.HTTP_201_CREATED)
async def upload_document(
    project_id: int,
    file: UploadFile = File(...),
    title: Optional[str] = Form(None),
    description: Optional[str] = Form(None),
    db: Session = Depends(get_db_dependency)
):
    """Upload a document for a project"""
    # TODO: Get current user from auth context
    uploaded_by = None
    
    try:
        document = await DocumentService.upload_document(
            project_id=project_id,
            file=file,
            title=title,
            description=description,
            uploaded_by=uploaded_by,
            db=db
        )
        return DocumentService.build_document_response(document, db)
    except Exception as e:
        db.rollback()
        if isinstance(e, Exception) and hasattr(e, 'status_code'):
            raise e
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to upload document: {str(e)}"
        )
