"""
User model - application users.
"""
from sqlalchemy import Column, String, BigInteger, DateTime, Boolean, ForeignKey, text
from sqlalchemy.orm import relationship
from .base import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    role_id = Column(BigInteger, ForeignKey('roles.id'), nullable=True)
    company_id = Column(BigInteger, ForeignKey('companies.id'), nullable=True)
    is_active = Column(Boolean, nullable=False, server_default=text('1'))
    email_verified = Column(Boolean, nullable=False, server_default=text('0'))
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
    
    # Relationships
    role = relationship("Role", backref="users")

