# Smart Sprint Backend (FastAPI)

FastAPI backend with MySQL. Quick setup below.

## Setup
1) Python env and deps
```
cd backend
python -m venv venv && ./venv/Scripts/activate  # Windows
pip install -r requirements.txt
```

2) Env vars
```
copy .env.example .env   # or create .env
# set MYSQL_HOST, MYSQL_PORT, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE
```

3) Run API
```
python main.py  # http://localhost:8000 (Swagger at /docs)
```

4) Database
```
-- in MySQL
CREATE DATABASE taskflow CHARACTER SET utf8mb4;
-- then run SQL files
backend/db/schema_mysql.sql
backend/db/permissions_seed.sql
```

Notes
- Do not commit .env or venv (see .gitignore).
- Seeded admin: admin@example.com / admin123 (change later).

