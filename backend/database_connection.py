"""
Database Connection Module
Handles actual MySQL database connections using SQLAlchemy.
"""

from sqlalchemy import create_engine, event
from sqlalchemy.orm import sessionmaker, Session
from sqlalchemy.pool import QueuePool
from config.database import db_settings, get_mysql_connection_string
import logging

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Create database engine
# This will connect to MySQL when first used
engine = None

def get_engine():
    """
    Get or create the database engine
    This creates a connection pool to MySQL
    """
    global engine
    if engine is None:
        connection_string = get_mysql_connection_string()
        
        # For local development, disable SSL verification if SSL mode is DISABLED
        if db_settings.mysql_ssl_mode == "DISABLED":
            connection_string = connection_string.replace("ssl_disabled=false", "ssl_disabled=true")
        
        try:
            engine = create_engine(
                connection_string,
                poolclass=QueuePool,
                pool_size=db_settings.mysql_pool_size,
                max_overflow=db_settings.mysql_max_overflow,
                pool_timeout=db_settings.mysql_pool_timeout,
                pool_recycle=db_settings.mysql_pool_recycle,
                echo=False,  # Set to True to see SQL queries in logs
                future=True
            )
            
            # Test the connection
            with engine.connect() as conn:
                logger.info("✅ Successfully connected to MySQL database")
                logger.info(f"   Database: {db_settings.mysql_database}")
                logger.info(f"   Host: {db_settings.mysql_host}:{db_settings.mysql_port}")
                
        except Exception as e:
            logger.error(f"❌ Failed to connect to MySQL: {e}")
            raise
    
    return engine


# Create session factory
# Sessions are like individual conversations with the database
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=None  # Will be set after engine is created
)


def init_db():
    """
    Initialize the database connection
    Call this when your app starts
    """
    engine = get_engine()
    SessionLocal.configure(bind=engine)
    logger.info("Database session factory configured")
    return engine


def get_db() -> Session:
    """
    Get a database session
    Use this as a dependency in FastAPI routes
    
    Example:
        @app.get("/users")
        def get_users(db: Session = Depends(get_db)):
            return db.query(User).all()
    """
    # Ensure session factory is bound to an engine
    try:
        # type: ignore[attr-defined] - SessionLocal may not expose 'kw' in some typings
        is_bound = getattr(SessionLocal, "kw", {}).get("bind") is not None  # pyright: ignore[reportOptionalMemberAccess]
    except Exception:
        is_bound = False

    if not is_bound:
        init_db()

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# Database dependency for FastAPI
def get_db_dependency():
    """
    FastAPI dependency for database sessions
    """
    # Ensure session factory is bound to an engine
    try:
        # type: ignore[attr-defined] - SessionLocal may not expose 'kw' in some typings
        is_bound = getattr(SessionLocal, "kw", {}).get("bind") is not None  # pyright: ignore[reportOptionalMemberAccess]
    except Exception:
        is_bound = False

    if not is_bound:
        init_db()

    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()



