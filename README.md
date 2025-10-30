# Smart Sprint

Smart Sprint is a modern project management app with Kanban boards, calendar, and role-based permissions. Frontend is React + TypeScript; backend is FastAPI + MySQL.

## Setup

Frontend
1. cd frontend
2. npm install
3. npm start (http://localhost:3000)

Backend
1. cd backend
2. python -m venv venv && ./venv/Scripts/activate (Windows)
3. pip install -r requirements.txt
4. copy .env.example to .env and fill MySQL settings
5. python main.py (http://localhost:8000, Swagger at /docs)

Database (MySQL 8.0)
1. CREATE DATABASE taskflow CHARACTER SET utf8mb4;
2. Run backend/db/schema_mysql.sql
3. Run backend/db/permissions_seed.sql (adds all permissions + admin user)

## Notes
- Don’t commit .env, node_modules, or venv (see .gitignore)


