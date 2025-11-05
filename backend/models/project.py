"""
Project and Sprint models.
"""
from sqlalchemy import Column, String, BigInteger, DateTime, ForeignKey, Text, Date, Numeric, text, Integer
from sqlalchemy.orm import relationship
from .base import Base


class ProjectStatus(Base):
    __tablename__ = 'project_status'

    id = Column(Integer, primary_key=True, autoincrement=True)  # TINYINT in MySQL
    key = Column(String(30), nullable=False, unique=True)
    name = Column(String(60), nullable=False)


class Project(Base):
    __tablename__ = 'projects'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    company_id = Column(BigInteger, ForeignKey('companies.id'), nullable=True)
    project_manager_id = Column(BigInteger, ForeignKey('users.id'), nullable=True)
    status_id = Column(Integer, ForeignKey('project_status.id'), nullable=True)  # TINYINT reference
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    budget = Column(Numeric(15, 2), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    # Relationships
    company = relationship("Company", backref="projects")
    project_manager = relationship("User", foreign_keys=[project_manager_id])
    status = relationship("ProjectStatus", foreign_keys=[status_id])


class SprintStatus(Base):
    __tablename__ = 'sprint_status'

    id = Column(Integer, primary_key=True, autoincrement=True)  # TINYINT in MySQL
    key = Column(String(30), nullable=False, unique=True)
    name = Column(String(60), nullable=False)


class Sprint(Base):
    __tablename__ = 'sprints'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)
    project_id = Column(BigInteger, ForeignKey('projects.id'), nullable=True)
    goal = Column(Text, nullable=True)
    start_date = Column(Date, nullable=False)
    end_date = Column(Date, nullable=False)
    status_id = Column(Integer, ForeignKey('sprint_status.id'), nullable=True)  # TINYINT reference
    capacity_hours = Column(Numeric(8, 2), nullable=False, server_default=text('0'))
    velocity_points = Column(Numeric(8, 2), nullable=False, server_default=text('0'))
    created_by = Column(BigInteger, ForeignKey('users.id'), nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

    # Relationships
    project = relationship("Project", backref="sprints")
    status = relationship("SprintStatus", foreign_keys=[status_id])
    creator = relationship("User", foreign_keys=[created_by])

