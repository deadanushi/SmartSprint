"""
Database Configuration Module
Prepares MySQL Enterprise Edition 8.0.44 connection configuration.
Note: Connection will be established when database module is initialized.
"""

from typing import Optional
from pydantic_settings import BaseSettings
from pydantic import Field
from dotenv import load_dotenv
import os

# Explicitly load .env file before BaseSettings reads it
# This ensures python-dotenv loads the file first
# Try multiple possible paths
backend_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
env_path = os.path.join(backend_dir, ".env")
if os.path.exists(env_path):
    load_dotenv(env_path, override=True)
else:
    # Fallback: try same directory as this file
    load_dotenv(os.path.join(os.path.dirname(__file__), ".env"), override=True)


class DatabaseSettings(BaseSettings):
    """Database configuration settings"""
    
    # MySQL Connection Settings
    mysql_host: str = Field(default="localhost", description="MySQL server host")
    mysql_port: int = Field(default=3306, description="MySQL server port")
    mysql_user: str = Field(default="root", description="MySQL username")
    mysql_password: str = Field(default="", description="MySQL password")
    mysql_database: str = Field(default="taskflow", description="MySQL database name")
    
    # Connection Pool Settings
    mysql_pool_size: int = Field(default=5, description="Connection pool size")
    mysql_max_overflow: int = Field(default=10, description="Max overflow connections")
    mysql_pool_timeout: int = Field(default=30, description="Connection pool timeout (seconds)")
    mysql_pool_recycle: int = Field(default=3600, description="Connection recycle time (seconds)")
    
    # SSL Settings (for MySQL Enterprise Edition)
    mysql_ssl_ca: Optional[str] = Field(default=None, description="SSL CA certificate path")
    mysql_ssl_cert: Optional[str] = Field(default=None, description="SSL client certificate path")
    mysql_ssl_key: Optional[str] = Field(default=None, description="SSL client key path")
    mysql_ssl_mode: str = Field(default="REQUIRED", description="SSL mode: DISABLED, PREFERRED, REQUIRED")
    
    class Config:
        # Use absolute path to .env file
        env_file = os.path.join(os.path.dirname(__file__), "..", ".env")
        env_file_encoding = "utf-8"
        env_prefix = "MYSQL_"
        case_sensitive = False
        # Make sure it reads from environment variables (which dotenv sets)
        env_nested_delimiter = "__"


# Global database settings instance
db_settings = DatabaseSettings()

# Fix: If password is empty, try reading directly from environment
# This handles cases where pydantic_settings doesn't read the password correctly
if not db_settings.mysql_password:
    db_settings.mysql_password = os.getenv("MYSQL_PASSWORD", "")


def get_mysql_connection_string() -> str:
    """
    Generate MySQL connection string for SQLAlchemy
    
    Format: mysql+pymysql://user:password@host:port/database?charset=utf8mb4
    """
    user = db_settings.mysql_user
    password = db_settings.mysql_password
    host = db_settings.mysql_host
    port = db_settings.mysql_port
    database = db_settings.mysql_database
    
    connection_string = (
        f"mysql+pymysql://{user}:{password}@{host}:{port}/{database}"
        f"?charset=utf8mb4"
    )
    
    return connection_string


def get_mysql_connection_params() -> dict:
    """
    Get MySQL connection parameters as dictionary
    Useful for mysql-connector-python or direct connections
    """
    params = {
        "host": db_settings.mysql_host,
        "port": db_settings.mysql_port,
        "user": db_settings.mysql_user,
        "password": db_settings.mysql_password,
        "database": db_settings.mysql_database,
        "charset": "utf8mb4",
        "collation": "utf8mb4_unicode_ci",
        "autocommit": False,
        "use_unicode": True,
        "connect_timeout": 10,
    }
    
    # Add SSL configuration if provided
    if db_settings.mysql_ssl_ca:
        params["ssl_ca"] = db_settings.mysql_ssl_ca
    if db_settings.mysql_ssl_cert:
        params["ssl_cert"] = db_settings.mysql_ssl_cert
    if db_settings.mysql_ssl_key:
        params["ssl_key"] = db_settings.mysql_ssl_key
    
    # SSL mode handling
    if db_settings.mysql_ssl_mode == "DISABLED":
        params["ssl_disabled"] = True
    elif db_settings.mysql_ssl_mode == "REQUIRED":
        params["ssl_disabled"] = False
        params["ssl_verify_cert"] = True
        params["ssl_verify_identity"] = True
    
    return params


# Connection notes for MySQL Enterprise Edition 8.0.44
"""
MySQL Enterprise Edition 8.0.44 Connection Notes:

1. **Connection Methods:**
   - SQLAlchemy (recommended for ORM): Uses PyMySQL driver
   - mysql-connector-python: Direct MySQL connector (supports enterprise features)
   - Both are included in requirements.txt

2. **Enterprise Features:**
   - SSL/TLS encryption support
   - Advanced authentication plugins
   - Connection pooling and resource management
   - Audit logging capabilities

3. **Configuration:**
   - Settings loaded from .env file with MYSQL_ prefix
   - Example .env entry:
     MYSQL_HOST=localhost
     MYSQL_PORT=3306
     MYSQL_USER=smarsprint_user
     MYSQL_PASSWORD=secure_password
     MYSQL_DATABASE=smarsprint
     MYSQL_SSL_MODE=REQUIRED

4. **Connection String Format:**
   - SQLAlchemy: mysql+pymysql://user:pass@host:port/db
   - mysql-connector: Use dictionary parameters

5. **Next Steps:**
   - Database connection will be implemented when ready
   - Use this module to configure and test connections
   - SQLAlchemy models will use these settings
"""

