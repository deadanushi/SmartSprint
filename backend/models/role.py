"""
Role model - user roles/positions.
"""
from sqlalchemy import Column, String, BigInteger, DateTime, text
from .base import Base

class Role(Base):
    __tablename__ = 'roles'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    role_key = Column(String(50), nullable=False, unique=True)
    name = Column(String(100), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))

