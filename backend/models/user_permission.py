"""
UserPermission model - explicit permissions granted to users.
"""
from sqlalchemy import Column, String, BigInteger, Boolean, ForeignKey, DateTime, UniqueConstraint, text
from .base import Base

class UserPermission(Base):
    __tablename__ = 'user_permissions'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    user_id = Column(BigInteger, ForeignKey('users.id', ondelete='CASCADE'), nullable=False)
    permission_key = Column(String(100), nullable=False)
    granted = Column(Boolean, nullable=False, server_default=text('0'))
    granted_by = Column(BigInteger, ForeignKey('users.id'), nullable=True)
    granted_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    
    __table_args__ = (
        UniqueConstraint('user_id', 'permission_key', name='uq_user_permission'),
    )


