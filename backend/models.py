from sqlalchemy.orm import declarative_base
from sqlalchemy import Column, String, BigInteger, Integer, DateTime, Boolean, text

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    email = Column(String(255), nullable=False, unique=True)
    password_hash = Column(String(255), nullable=False)
    first_name = Column(String(100), nullable=False)
    last_name = Column(String(100), nullable=False)
    avatar_url = Column(String(500), nullable=True)
    role = Column(String(50), nullable=False, server_default=text("'member'"))
    is_active = Column(Boolean, nullable=False, server_default=text('1'))
    email_verified = Column(Boolean, nullable=False, server_default=text('0'))
    last_login = Column(DateTime, nullable=True)
    created_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP'))
    updated_at = Column(DateTime, nullable=False, server_default=text('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'))
