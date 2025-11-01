"""
Company model - organizations/companies.
"""
from sqlalchemy import Column, String, BigInteger, Integer, DateTime, Boolean, text
from .base import Base

class Company(Base):
    __tablename__ = 'companies'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    name = Column(String(255), nullable=False)
    domain = Column(String(100), nullable=True)
    logo_url = Column(String(500), nullable=True)
    subscription_plan = Column(String(50), nullable=True)
    max_users = Column(Integer, nullable=True)
    is_active = Column(Boolean, nullable=False, server_default=text('1'))
    created_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))

