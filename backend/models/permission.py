"""
Permission model - available permissions in the system.
"""
from sqlalchemy import Column, String, BigInteger, DateTime, text
from .base import Base

class Permission(Base):
    __tablename__ = 'permissions'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    perm_key = Column(String(100), nullable=False, unique=True)
    name = Column(String(140), nullable=False)
    category = Column(String(60), nullable=False)
    created_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))


