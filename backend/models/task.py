"""
Task model - tasks in projects.
"""
from sqlalchemy import Column, String, BigInteger, DateTime, Boolean, ForeignKey, Text, Integer, Numeric, Date, text
from sqlalchemy.orm import relationship
from .base import Base


class TaskStatus(Base):
    __tablename__ = 'task_status'

    id = Column(Integer, primary_key=True, autoincrement=True)  # TINYINT in MySQL
    key = Column(String(30), nullable=False, unique=True)
    name = Column(String(60), nullable=False)


class TaskPriority(Base):
    __tablename__ = 'task_priority'

    id = Column(Integer, primary_key=True, autoincrement=True)  # TINYINT in MySQL
    key = Column(String(20), nullable=False, unique=True)
    name = Column(String(40), nullable=False)


class TaskType(Base):
    __tablename__ = 'task_type'

    id = Column(Integer, primary_key=True, autoincrement=True)  # TINYINT in MySQL
    key = Column(String(30), nullable=False, unique=True)
    name = Column(String(60), nullable=False)


class Task(Base):
    __tablename__ = 'tasks'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    title = Column(String(500), nullable=False)
    description = Column(Text, nullable=True)
    project_id = Column(BigInteger, ForeignKey('projects.id'), nullable=True)
    sprint_id = Column(BigInteger, ForeignKey('sprints.id'), nullable=True)
    status_id = Column(Integer, ForeignKey('task_status.id'), nullable=True)  # TINYINT reference
    priority_id = Column(Integer, ForeignKey('task_priority.id'), nullable=True)  # TINYINT reference
    task_type_id = Column(Integer, ForeignKey('task_type.id'), nullable=True)  # TINYINT reference
    assignee_id = Column(BigInteger, ForeignKey('users.id'), nullable=True)
    reviewer_id = Column(BigInteger, ForeignKey('users.id'), nullable=True)
    due_date = Column(DateTime, nullable=True)
    estimated_hours = Column(Numeric(5, 2), nullable=True)
    actual_hours = Column(Numeric(5, 2), nullable=True)
    progress_percentage = Column(Integer, nullable=False, server_default=text('0'))
    created_by = Column(BigInteger, ForeignKey('users.id'), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    # Relationships
    project = relationship("Project", backref="tasks")
    sprint = relationship("Sprint", backref="tasks")
    status = relationship("TaskStatus", foreign_keys=[status_id])
    priority = relationship("TaskPriority", foreign_keys=[priority_id])
    task_type = relationship("TaskType", foreign_keys=[task_type_id])
    assignee = relationship("User", foreign_keys=[assignee_id])
    reviewer = relationship("User", foreign_keys=[reviewer_id])
    creator = relationship("User", foreign_keys=[created_by])
    assignees = relationship("TaskAssignee", back_populates="task", cascade="all, delete-orphan")
    links = relationship("TaskLink", back_populates="task", cascade="all, delete-orphan")
    comments = relationship("Comment", back_populates="task", cascade="all, delete-orphan")


class TaskAssignee(Base):
    __tablename__ = 'task_assignees'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    task_id = Column(BigInteger, ForeignKey('tasks.id'), nullable=False)
    user_id = Column(BigInteger, ForeignKey('users.id'), nullable=False)
    assigned_by = Column(BigInteger, ForeignKey('users.id'), nullable=True)
    assigned_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))

    # Relationships
    task = relationship("Task", back_populates="assignees")
    user = relationship("User", foreign_keys=[user_id])
    assigned_by_user = relationship("User", foreign_keys=[assigned_by])


class TaskLink(Base):
    __tablename__ = 'task_links'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    task_id = Column(BigInteger, ForeignKey('tasks.id'), nullable=False)
    url = Column(String(500), nullable=False)
    title = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    link_type = Column(String(50), nullable=False, server_default='external')
    created_by = Column(BigInteger, ForeignKey('users.id'), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    # Relationships
    task = relationship("Task", back_populates="links")
    creator = relationship("User", foreign_keys=[created_by])


class Comment(Base):
    __tablename__ = 'comments'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    content = Column(Text, nullable=False)
    task_id = Column(BigInteger, ForeignKey('tasks.id'), nullable=False)
    parent_comment_id = Column(BigInteger, ForeignKey('comments.id'), nullable=True)
    author_id = Column(BigInteger, ForeignKey('users.id'), nullable=True)
    is_edited = Column(Boolean, nullable=False, server_default=text('0'))
    edited_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    # Relationships
    task = relationship("Task", back_populates="comments")
    author = relationship("User", foreign_keys=[author_id])
    parent_comment = relationship("Comment", remote_side=[id], backref="replies")

