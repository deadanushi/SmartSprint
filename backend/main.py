"""
TaskFlow Backend - FastAPI Application
Main entry point for the TaskFlow backend API server.
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import logging
import os
import threading
import time
import webbrowser

# Set up logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI app
app = FastAPI(
    title="TaskFlow API",
    description="TaskFlow Advanced Project Management System - Backend API",
    version="1.0.0"
)

# Configure CORS to allow frontend connections
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",  # React dev server
        "http://localhost:3001",
        "http://127.0.0.1:3000",
        "http://localhost:5173",  # Vite default
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _open_swagger_after_start(delay_seconds: float = 1.0) -> None:
    """Open Swagger UI in the default browser after a small delay."""
    def _worker():
        time.sleep(delay_seconds)
        try:
            webbrowser.open_new("http://localhost:8000/docs")
        except Exception:
            pass
    threading.Thread(target=_worker, daemon=True).start()


@app.on_event("startup")
async def startup_event():
    """Initialize database connection when app starts"""
    try:
        from database_connection import init_db
        init_db()
        logger.info("✅ Database connection initialized")
    except Exception as e:
        logger.warning(f"⚠️  Database connection not available: {e}")
        logger.info("   You can still run the API, but database features won't work")
        logger.info("   Make sure you've created .env file and installed dependencies")

    # Auto-open Swagger UI unless explicitly disabled
    if os.getenv("OPEN_SWAGGER", "1") not in ("0", "false", "False"):
        _open_swagger_after_start(1.0)

# Routers
from routes_users import router as users_router
app.include_router(users_router)


@app.get("/")
async def root():
    """Root endpoint - API health check"""
    return JSONResponse({
        "message": "TaskFlow API is running",
        "status": "healthy",
        "version": "1.0.0"
    })


@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return JSONResponse({
        "status": "healthy",
        "service": "TaskFlow API"
    })


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

