"""
RoleHasPermission model - many-to-many relationship between roles and permissions.
"""
from sqlalchemy import Column, BigInteger, ForeignKey, UniqueConstraint
from .base import Base

class RoleHasPermission(Base):
    __tablename__ = 'role_has_permission'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    role_id = Column(BigInteger, ForeignKey('roles.id', ondelete='CASCADE'), nullable=False)
    permission_id = Column(BigInteger, ForeignKey('permissions.id', ondelete='CASCADE'), nullable=False)
    
    __table_args__ = (
        UniqueConstraint('role_id', 'permission_id', name='uq_role_permission'),
    )


