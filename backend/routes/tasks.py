"""
Tasks API routes - manage tasks in projects.
Routes handle HTTP concerns only, business logic is in services.
"""
from fastapi import APIRouter, Depends, status
from sqlalchemy.orm import Session
from typing import Optional, List

from database_connection import get_db_dependency
from services.task_service import TaskService
from schemas.task import TaskCreate, TaskUpdate, TaskResponse

router = APIRouter(prefix="/api/tasks", tags=["tasks"])


@router.get("", response_model=List[TaskResponse])
def list_tasks(
    project_id: Optional[int] = None,
    sprint_id: Optional[int] = None,
    status_key: Optional[str] = None,
    priority_key: Optional[str] = None,
    task_type_key: Optional[str] = None,
    assignee_id: Optional[int] = None,
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db_dependency)
):
    """
    Get all tasks with optional filtering.
    """
    tasks = TaskService.list_tasks(
        db=db,
        project_id=project_id,
        sprint_id=sprint_id,
        status_key=status_key,
        priority_key=priority_key,
        task_type_key=task_type_key,
        assignee_id=assignee_id,
        skip=skip,
        limit=limit
    )
    
    return [TaskService.build_task_response(task, db) for task in tasks]


@router.get("/{task_id}", response_model=TaskResponse)
def get_task(task_id: int, db: Session = Depends(get_db_dependency)):
    """
    Get a specific task by ID.
    """
    task = TaskService.get_task_by_id(task_id, db)
    return TaskService.build_task_response(task, db)


@router.post("", response_model=TaskResponse, status_code=status.HTTP_201_CREATED)
def create_task(payload: TaskCreate, db: Session = Depends(get_db_dependency)):
    """
    Create a new task.
    """
    try:
        task = TaskService.create_task(payload, db)
        return TaskService.build_task_response(task, db)
    except Exception as e:
        db.rollback()
        if isinstance(e, Exception) and hasattr(e, 'status_code'):
            raise e
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to create task: {str(e)}"
        )


@router.patch("/{task_id}", response_model=TaskResponse)
def update_task(
    task_id: int,
    payload: TaskUpdate,
    db: Session = Depends(get_db_dependency)
):
    """
    Update a task.
    """
    try:
        task = TaskService.update_task(task_id, payload, db)
        return TaskService.build_task_response(task, db)
    except Exception as e:
        db.rollback()
        if isinstance(e, Exception) and hasattr(e, 'status_code'):
            raise e
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to update task: {str(e)}"
        )


@router.delete("/{task_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_task(task_id: int, db: Session = Depends(get_db_dependency)):
    """
    Delete a task.
    """
    try:
        TaskService.delete_task(task_id, db)
        return None
    except Exception as e:
        db.rollback()
        if isinstance(e, Exception) and hasattr(e, 'status_code'):
            raise e
        from fastapi import HTTPException
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to delete task: {str(e)}"
        )


@router.get("/statuses", response_model=List[dict])
def get_task_statuses(db: Session = Depends(get_db_dependency)):
    """
    Get all task statuses.
    """
    return TaskService.get_task_statuses(db)


@router.get("/priorities", response_model=List[dict])
def get_task_priorities(db: Session = Depends(get_db_dependency)):
    """
    Get all task priorities.
    """
    return TaskService.get_task_priorities(db)


@router.get("/types", response_model=List[dict])
def get_task_types(db: Session = Depends(get_db_dependency)):
    """
    Get all task types.
    """
    return TaskService.get_task_types(db)
