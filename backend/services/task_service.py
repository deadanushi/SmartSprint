
from sqlalchemy.orm import Session, joinedload
from sqlalchemy import func
from typing import Optional, List
from fastapi import HTTPException, status

from models.task import Task, TaskStatus, TaskPriority, TaskType, TaskAssignee, TaskLink, Comment
from models.project import Project, Sprint
from models.user import User
from schemas.task import TaskCreate, TaskUpdate, TaskResponse, TaskAssigneeResponse


class TaskService:
    """Service class for task business logic"""
    
    @staticmethod
    def build_task_response(task: Task, db: Session) -> TaskResponse:
        """Build TaskResponse with all relationships and counts"""
        # Get assignees
        assignees_data = []
        for ta in task.assignees:
            user = db.query(User).filter(User.id == ta.user_id).first()
            assignees_data.append(TaskAssigneeResponse(
                id=ta.id,
                user_id=ta.user_id,
                user_name=f"{user.first_name} {user.last_name}" if user else None,
                user_email=user.email if user else None,
                assigned_at=ta.assigned_at
            ))
        
        # Get counts
        links_count = db.query(func.count(TaskLink.id)).filter(TaskLink.task_id == task.id).scalar() or 0
        comments_count = db.query(func.count(Comment.id)).filter(Comment.task_id == task.id).scalar() or 0
        
        # Get project and sprint names
        project_name = None
        if task.project_id:
            project = db.query(Project).filter(Project.id == task.project_id).first()
            project_name = project.name if project else None
        
        sprint_name = None
        if task.sprint_id:
            sprint = db.query(Sprint).filter(Sprint.id == task.sprint_id).first()
            sprint_name = sprint.name if sprint else None
        
        # Get reviewer name
        reviewer_name = None
        if task.reviewer_id:
            reviewer = db.query(User).filter(User.id == task.reviewer_id).first()
            reviewer_name = f"{reviewer.first_name} {reviewer.last_name}" if reviewer else None
        
        # Get creator name
        creator_name = None
        if task.created_by:
            creator = db.query(User).filter(User.id == task.created_by).first()
            creator_name = f"{creator.first_name} {creator.last_name}" if creator else None
        
        return TaskResponse(
            id=task.id,
            title=task.title,
            description=task.description,
            project_id=task.project_id,
            project_name=project_name,
            sprint_id=task.sprint_id,
            sprint_name=sprint_name,
            status_key=task.status.key if task.status else None,
            status_name=task.status.name if task.status else None,
            priority_key=task.priority.key if task.priority else None,
            priority_name=task.priority.name if task.priority else None,
            task_type_key=task.task_type.key if task.task_type else None,
            task_type_name=task.task_type.name if task.task_type else None,
            assignee_id=task.assignee_id,
            reviewer_id=task.reviewer_id,
            reviewer_name=reviewer_name,
            assignees=assignees_data,
            links_count=links_count,
            comments_count=comments_count,
            due_date=task.due_date,
            estimated_hours=float(task.estimated_hours) if task.estimated_hours else None,
            actual_hours=float(task.actual_hours) if task.actual_hours else None,
            progress_percentage=task.progress_percentage or 0,
            created_by=task.created_by,
            creator_name=creator_name,
            created_at=task.created_at,
            updated_at=task.updated_at
        )
    
    @staticmethod
    def get_task_by_id(task_id: int, db: Session) -> Task:
        """Get a task by ID, raising HTTPException if not found"""
        task = db.query(Task).options(
            joinedload(Task.status),
            joinedload(Task.priority),
            joinedload(Task.task_type),
            joinedload(Task.assignees)
        ).filter(Task.id == task_id).first()
        
        if not task:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="Task not found"
            )
        return task
    
    @staticmethod
    def list_tasks(
        db: Session,
        project_id: Optional[int] = None,
        sprint_id: Optional[int] = None,
        status_key: Optional[str] = None,
        priority_key: Optional[str] = None,
        task_type_key: Optional[str] = None,
        assignee_id: Optional[int] = None,
        skip: int = 0,
        limit: int = 100
    ) -> List[Task]:
        """List tasks with optional filtering"""
        query = db.query(Task).options(
            joinedload(Task.status),
            joinedload(Task.priority),
            joinedload(Task.task_type)
        )
        
        if project_id:
            query = query.filter(Task.project_id == project_id)
        
        if sprint_id:
            query = query.filter(Task.sprint_id == sprint_id)
        
        if status_key:
            status = db.query(TaskStatus).filter(TaskStatus.key == status_key).first()
            if status:
                query = query.filter(Task.status_id == status.id)
        
        if priority_key:
            priority = db.query(TaskPriority).filter(TaskPriority.key == priority_key).first()
            if priority:
                query = query.filter(Task.priority_id == priority.id)
        
        if task_type_key:
            task_type = db.query(TaskType).filter(TaskType.key == task_type_key).first()
            if task_type:
                query = query.filter(Task.task_type_id == task_type.id)
        
        if assignee_id:
            query = query.join(TaskAssignee).filter(TaskAssignee.user_id == assignee_id)
        
        return query.offset(skip).limit(limit).all()
    
    @staticmethod
    def validate_status_key(status_key: Optional[str], db: Session) -> Optional[int]:
        """Validate status_key and return status_id"""
        if not status_key:
            return None
        status = db.query(TaskStatus).filter(TaskStatus.key == status_key).first()
        if not status:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Task status '{status_key}' not found"
            )
        return status.id
    
    @staticmethod
    def validate_priority_key(priority_key: Optional[str], db: Session) -> Optional[int]:
        """Validate priority_key and return priority_id"""
        if not priority_key:
            return None
        priority = db.query(TaskPriority).filter(TaskPriority.key == priority_key).first()
        if not priority:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Task priority '{priority_key}' not found"
            )
        return priority.id
    
    @staticmethod
    def validate_task_type_key(task_type_key: Optional[str], db: Session) -> Optional[int]:
        """Validate task_type_key and return task_type_id"""
        if not task_type_key:
            return None
        task_type = db.query(TaskType).filter(TaskType.key == task_type_key).first()
        if not task_type:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Task type '{task_type_key}' not found"
            )
        return task_type.id
    
    @staticmethod
    def validate_project(project_id: Optional[int], db: Session) -> None:
        """Validate project exists"""
        if project_id:
            project = db.query(Project).filter(Project.id == project_id).first()
            if not project:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Project with id {project_id} not found"
                )
    
    @staticmethod
    def validate_sprint(sprint_id: Optional[int], db: Session) -> None:
        """Validate sprint exists"""
        if sprint_id:
            sprint = db.query(Sprint).filter(Sprint.id == sprint_id).first()
            if not sprint:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Sprint with id {sprint_id} not found"
                )
    
    @staticmethod
    def validate_reviewer(reviewer_id: Optional[int], db: Session) -> None:
        """Validate reviewer user exists"""
        if reviewer_id:
            reviewer = db.query(User).filter(User.id == reviewer_id).first()
            if not reviewer:
                raise HTTPException(
                    status_code=status.HTTP_400_BAD_REQUEST,
                    detail=f"Reviewer with id {reviewer_id} not found"
                )
    
    @staticmethod
    def create_task(payload: TaskCreate, db: Session) -> Task:
        """Create a new task with validation"""
        # Validate lookup keys
        status_id = TaskService.validate_status_key(payload.status_key, db)
        priority_id = TaskService.validate_priority_key(payload.priority_key, db)
        task_type_id = TaskService.validate_task_type_key(payload.task_type_key, db)
        
        # Validate relationships
        TaskService.validate_project(payload.project_id, db)
        TaskService.validate_sprint(payload.sprint_id, db)
        TaskService.validate_reviewer(payload.reviewer_id, db)
        
        # Create task
        task = Task(
            title=payload.title,
            description=payload.description,
            project_id=payload.project_id,
            sprint_id=payload.sprint_id,
            status_id=status_id,
            priority_id=priority_id,
            task_type_id=task_type_id,
            reviewer_id=payload.reviewer_id,
            due_date=payload.due_date,
            estimated_hours=payload.estimated_hours,
            progress_percentage=payload.progress_percentage or 0,
            created_by=payload.created_by,
            assignee_id=payload.assignee_ids[0] if payload.assignee_ids and len(payload.assignee_ids) > 0 else None
        )
        
        db.add(task)
        db.commit()
        db.refresh(task)
        
        # Add assignees
        if payload.assignee_ids:
            for user_id in payload.assignee_ids:
                user = db.query(User).filter(User.id == user_id).first()
                if user:
                    task_assignee = TaskAssignee(
                        task_id=task.id,
                        user_id=user_id,
                        assigned_by=payload.created_by
                    )
                    db.add(task_assignee)
            db.commit()
        
        # Reload with relationships
        return db.query(Task).options(
            joinedload(Task.status),
            joinedload(Task.priority),
            joinedload(Task.task_type),
            joinedload(Task.assignees)
        ).filter(Task.id == task.id).first()
    
    @staticmethod
    def update_task(task_id: int, payload: TaskUpdate, db: Session) -> Task:
        """Update a task with validation"""
        task = TaskService.get_task_by_id(task_id, db)
        
        # Update basic fields
        if payload.title is not None:
            task.title = payload.title
        if payload.description is not None:
            task.description = payload.description
        
        # Update project
        if payload.project_id is not None:
            if payload.project_id != 0:
                TaskService.validate_project(payload.project_id, db)
            task.project_id = payload.project_id if payload.project_id != 0 else None
        
        # Update sprint
        if payload.sprint_id is not None:
            if payload.sprint_id != 0:
                TaskService.validate_sprint(payload.sprint_id, db)
            task.sprint_id = payload.sprint_id if payload.sprint_id != 0 else None
        
        # Update status
        if payload.status_key is not None:
            task.status_id = TaskService.validate_status_key(payload.status_key, db) if payload.status_key else None
        
        # Update priority
        if payload.priority_key is not None:
            task.priority_id = TaskService.validate_priority_key(payload.priority_key, db) if payload.priority_key else None
        
        # Update task type
        if payload.task_type_key is not None:
            task.task_type_id = TaskService.validate_task_type_key(payload.task_type_key, db) if payload.task_type_key else None
        
        # Update reviewer
        if payload.reviewer_id is not None:
            if payload.reviewer_id != 0:
                TaskService.validate_reviewer(payload.reviewer_id, db)
            task.reviewer_id = payload.reviewer_id if payload.reviewer_id != 0 else None
        
        # Update other fields
        if payload.due_date is not None:
            task.due_date = payload.due_date
        if payload.estimated_hours is not None:
            task.estimated_hours = payload.estimated_hours
        if payload.actual_hours is not None:
            task.actual_hours = payload.actual_hours
        if payload.progress_percentage is not None:
            task.progress_percentage = payload.progress_percentage
        
        # Update assignees
        if payload.assignee_ids is not None:
            db.query(TaskAssignee).filter(TaskAssignee.task_id == task_id).delete()
            
            if payload.assignee_ids:
                for user_id in payload.assignee_ids:
                    user = db.query(User).filter(User.id == user_id).first()
                    if user:
                        task_assignee = TaskAssignee(
                            task_id=task.id,
                            user_id=user_id,
                            assigned_by=task.created_by
                        )
                        db.add(task_assignee)
            
            task.assignee_id = payload.assignee_ids[0] if payload.assignee_ids and len(payload.assignee_ids) > 0 else None
        
        db.commit()
        db.refresh(task)
        
        # Reload with relationships
        return db.query(Task).options(
            joinedload(Task.status),
            joinedload(Task.priority),
            joinedload(Task.task_type),
            joinedload(Task.assignees)
        ).filter(Task.id == task_id).first()
    
    @staticmethod
    def delete_task(task_id: int, db: Session) -> None:
        """Delete a task"""
        task = TaskService.get_task_by_id(task_id, db)
        db.delete(task)
        db.commit()
    
    @staticmethod
    def get_task_statuses(db: Session) -> List[dict]:
        """Get all task statuses"""
        statuses = db.query(TaskStatus).order_by(TaskStatus.id).all()
        return [{"key": status.key, "name": status.name} for status in statuses]
    
    @staticmethod
    def get_task_priorities(db: Session) -> List[dict]:
        """Get all task priorities"""
        priorities = db.query(TaskPriority).order_by(TaskPriority.id).all()
        return [{"key": priority.key, "name": priority.name} for priority in priorities]
    
    @staticmethod
    def get_task_types(db: Session) -> List[dict]:
        """Get all task types"""
        types = db.query(TaskType).order_by(TaskType.id).all()
        return [{"key": task_type.key, "name": task_type.name} for task_type in types]

