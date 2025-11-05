"""
Projects API routes - manage projects.
Routes handle HTTP concerns only, business logic is in services.
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import Optional, List

from database_connection import get_db_dependency
from services.project_service import ProjectService
from schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse

router = APIRouter(prefix="/api/projects", tags=["projects"])


@router.get("", response_model=List[ProjectResponse])
def list_projects(
    company_id: Optional[int] = None,
    project_manager_id: Optional[int] = None,
    status_key: Optional[str] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db_dependency)
):
    """
    Get all projects with optional filtering.
    """
    projects = ProjectService.list_projects(
        db=db,
        company_id=company_id,
        project_manager_id=project_manager_id,
        status_key=status_key,
        skip=skip,
        limit=limit
    )
    
    return [ProjectService.build_project_response(project, db) for project in projects]


@router.get("/{project_id}", response_model=ProjectResponse)
def get_project(project_id: int, db: Session = Depends(get_db_dependency)):
    """
    Get a specific project by ID.
    """
    project = ProjectService.get_project_by_id(project_id, db)
    return ProjectService.build_project_response(project, db)


@router.post("", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(payload: ProjectCreate, db: Session = Depends(get_db_dependency)):
    """
    Create a new project.
    """
    try:
        project = ProjectService.create_project(payload, db)
        return ProjectService.build_project_response(project, db)
    except Exception as e:
        db.rollback()
        if isinstance(e, Exception) and hasattr(e, 'status_code'):
            raise e
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create project: {str(e)}"
        )


@router.patch("/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: int,
    payload: ProjectUpdate,
    db: Session = Depends(get_db_dependency)
):
    """
    Update a project.
    """
    try:
        project = ProjectService.update_project(project_id, payload, db)
        return ProjectService.build_project_response(project, db)
    except Exception as e:
        db.rollback()
        if isinstance(e, Exception) and hasattr(e, 'status_code'):
            raise e
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update project: {str(e)}"
        )


@router.delete("/{project_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_project(project_id: int, db: Session = Depends(get_db_dependency)):
    """
    Delete a project.
    """
    try:
        ProjectService.delete_project(project_id, db)
        return None
    except Exception as e:
        db.rollback()
        if isinstance(e, Exception) and hasattr(e, 'status_code'):
            raise e
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete project: {str(e)}"
        )
