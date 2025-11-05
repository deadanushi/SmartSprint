"""
Project Service - Business logic for project management.
Handles all project-related operations, validation, and data transformation.
"""
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func, text
from typing import Optional, List
from datetime import datetime, date
from fastapi import HTTPException, status

from models.project import Project, ProjectStatus, Sprint
from models.task import Task
from models.user import User
from models.company import Company
from schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse


class ProjectService:
    """Service class for project business logic"""
    
    @staticmethod
    def parse_date(date_str: Optional[str]) -> Optional[date]:
        """Parse date string to date object"""
        if not date_str:
            return None
        try:
            return datetime.strptime(date_str, "%Y-%m-%d").date()
        except (ValueError, TypeError):
            return None
    
    @staticmethod
    def validate_dates(start_date: Optional[date], end_date: Optional[date]) -> None:
        """Validate that start_date is not after end_date"""
        if start_date and end_date and start_date > end_date:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Start date cannot be after end date"
            )
    
    @staticmethod
    def build_project_response(project: Project, db: Session) -> ProjectResponse:
        """Build ProjectResponse with all relationships and counts"""
        # Get counts
        tasks_count = db.query(func.count(Task.id)).filter(Task.project_id == project.id).scalar() or 0
        
        sprints_count = db.query(func.count(Sprint.id)).filter(Sprint.project_id == project.id).scalar() or 0
        
        # Get members count from user_projects table
        members_result = db.execute(
            text("SELECT COUNT(*) as count FROM user_projects WHERE project_id = :project_id"),
            {"project_id": project.id}
        ).fetchone()
        members_count = members_result[0] if members_result else 0
        
        # Get company name
        company_name = None
        if project.company_id:
            company = db.query(Company).filter(Company.id == project.company_id).first()
            company_name = company.name if company else None
        
        # Get project manager name
        project_manager_name = None
        if project.project_manager_id:
            pm = db.query(User).filter(User.id == project.project_manager_id).first()
            project_manager_name = f"{pm.first_name} {pm.last_name}" if pm else None
        
        # Format dates as strings
        start_date_str = project.start_date.isoformat() if project.start_date else None
        end_date_str = project.end_date.isoformat() if project.end_date else None
        
        return ProjectResponse(
            id=project.id,
            name=project.name,
            description=project.description,
            company_id=project.company_id,
            company_name=company_name,
            project_manager_id=project.project_manager_id,
            project_manager_name=project_manager_name,
            status_key=project.status.key if project.status else None,
            status_name=project.status.name if project.status else None,
            start_date=start_date_str,
            end_date=end_date_str,
            budget=float(project.budget) if project.budget else None,
            tasks_count=tasks_count,
            sprints_count=sprints_count,
            members_count=members_count,
            created_at=project.created_at,
            updated_at=project.updated_at
        )
    
    @staticmethod
    def get_project_by_id(project_id: int, db: Session) -> Project:
        """Get a project by ID, raising HTTPException if not found"""
        project = db.query(Project).options(
            joinedload(Project.status),
            joinedload(Project.company),
            joinedload(Project.project_manager)
        ).filter(Project.id == project_id).first()
        
        if not project:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Project not found"
            )
        return project
    
    @staticmethod
    def list_projects(
        db: Session,
        company_id: Optional[int] = None,
        project_manager_id: Optional[int] = None,
        status_key: Optional[str] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Project]:
        """List projects with optional filtering"""
        query = db.query(Project).options(
            joinedload(Project.status),
            joinedload(Project.company),
            joinedload(Project.project_manager)
        )
        
        if company_id:
            query = query.filter(Project.company_id == company_id)
        
        if project_manager_id:
            query = query.filter(Project.project_manager_id == project_manager_id)
        
        if status_key:
            status = db.query(ProjectStatus).filter(ProjectStatus.key == status_key).first()
            if status:
                query = query.filter(Project.status_id == status.id)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def validate_status_key(status_key: Optional[str], db: Session) -> Optional[int]:
        """Validate status_key and return status_id"""
        if not status_key:
            return None
        status = db.query(ProjectStatus).filter(ProjectStatus.key == status_key).first()
        if not status:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Project status '{status_key}' not found"
            )
        return status.id
    
    @staticmethod
    def validate_company(company_id: Optional[int], db: Session) -> None:
        """Validate company exists"""
        if company_id:
            company = db.query(Company).filter(Company.id == company_id).first()
            if not company:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Company with id {company_id} not found"
                )
    
    @staticmethod
    def validate_project_manager(project_manager_id: Optional[int], db: Session) -> None:
        """Validate project manager user exists"""
        if project_manager_id:
            pm = db.query(User).filter(User.id == project_manager_id).first()
            if not pm:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Project manager with id {project_manager_id} not found"
                )
    
    @staticmethod
    def create_project(payload: ProjectCreate, db: Session) -> Project:
        """Create a new project with validation"""
        # Validate lookup keys
        status_id = ProjectService.validate_status_key(payload.status_key, db)
        
        # Validate relationships
        ProjectService.validate_company(payload.company_id, db)
        ProjectService.validate_project_manager(payload.project_manager_id, db)
        
        # Parse dates
        start_date = ProjectService.parse_date(payload.start_date)
        end_date = ProjectService.parse_date(payload.end_date)
        
        # Validate dates
        ProjectService.validate_dates(start_date, end_date)
        
        # Create project
        project = Project(
            name=payload.name,
            description=payload.description,
            company_id=payload.company_id,
            project_manager_id=payload.project_manager_id,
            status_id=status_id,
            start_date=start_date,
            end_date=end_date,
            budget=payload.budget
        )
        
        db.add(project)
        db.commit()
        db.refresh(project)
        
        # Reload with relationships
        return db.query(Project).options(
            joinedload(Project.status),
            joinedload(Project.company),
            joinedload(Project.project_manager)
        ).filter(Project.id == project.id).first()
    
    @staticmethod
    def update_project(project_id: int, payload: ProjectUpdate, db: Session) -> Project:
        """Update a project with validation"""
        project = ProjectService.get_project_by_id(project_id, db)
        
        # Update basic fields
        if payload.name is not None:
            project.name = payload.name
        if payload.description is not None:
            project.description = payload.description
        
        # Update company
        if payload.company_id is not None:
            if payload.company_id != 0:
                ProjectService.validate_company(payload.company_id, db)
            project.company_id = payload.company_id if payload.company_id != 0 else None
        
        # Update project manager
        if payload.project_manager_id is not None:
            if payload.project_manager_id != 0:
                ProjectService.validate_project_manager(payload.project_manager_id, db)
            project.project_manager_id = payload.project_manager_id if payload.project_manager_id != 0 else None
        
        # Update status
        if payload.status_key is not None:
            project.status_id = ProjectService.validate_status_key(payload.status_key, db) if payload.status_key else None
        
        # Update dates
        if payload.start_date is not None:
            start_date = ProjectService.parse_date(payload.start_date)
            project.start_date = start_date
        
        if payload.end_date is not None:
            end_date = ProjectService.parse_date(payload.end_date)
            project.end_date = end_date
        
        # Validate dates if both are set
        ProjectService.validate_dates(project.start_date, project.end_date)
        
        # Update budget
        if payload.budget is not None:
            project.budget = payload.budget
        
        db.commit()
        db.refresh(project)
        
        # Reload with relationships
        return db.query(Project).options(
            joinedload(Project.status),
            joinedload(Project.company),
            joinedload(Project.project_manager)
        ).filter(Project.id == project_id).first()
    
    @staticmethod
    def delete_project(project_id: int, db: Session) -> None:
        """Delete a project"""
        project = ProjectService.get_project_by_id(project_id, db)
        db.delete(project)
        db.commit()

