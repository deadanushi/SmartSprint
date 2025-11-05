# Database Schema Files

This directory contains the database schema and seed data for SmartSprint.

## Files

### `schema.sql`
Complete database schema with all tables, relationships, and indexes.
- **Purpose**: Creates all database tables
- **Safe to run**: Yes (uses `IF NOT EXISTS`)
- **Usage**: Run this first to create the database structure

### `seed.sql`
Initial seed data for lookup tables and admin user.
- **Purpose**: Populates lookup tables and creates admin user
- **Safe to run**: Yes (uses `ON DUPLICATE KEY UPDATE`)
- **Usage**: Run after `schema.sql` to populate initial data

## Setup Instructions

1. **Create Database** (if not exists):
   ```sql
   CREATE DATABASE IF NOT EXISTS smarsprint CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   USE smarsprint;
   ```

2. **Run Schema**:
   ```bash
   mysql -u your_user -p smarsprint < db/schema.sql
   ```

3. **Run Seed Data**:
   ```bash
   mysql -u your_user -p smarsprint < db/seed.sql
   ```

## Default Admin User

After running seed.sql:
- **Email**: `admin@example.com`
- **Password**: `admin123`
- **Role**: Administrator (has all permissions)

## Database Structure

### Lookup Tables
- `roles` - User roles
- `project_status` - Project statuses
- `sprint_status` - Sprint statuses
- `task_status` - Task statuses
- `task_priority` - Task priorities
- `task_type` - Task types
- `dependency_type` - Task dependency types
- `event_type` - Calendar event types
- `event_priority` - Event priorities
- `event_status` - Event statuses
- `processing_type` - AI processing types
- `processing_status` - Processing statuses

### Core Tables
- `companies` - Organizations
- `users` - User accounts
- `permissions` - System permissions
- `role_has_permission` - Role-permission mapping
- `user_permissions` - User-permission mapping
- `projects` - Projects
- `user_projects` - Project members
- `sprints` - Sprints

### Task Management
- `tasks` - Tasks
- `task_dependencies` - Task dependencies
- `task_attachments` - Task file attachments
- `task_assignees` - Task assignees (many-to-many)
- `task_links` - Task links
- `comments` - Task comments (supports nested)

### Document Management
- `documents` - Uploaded documents
- `document_versions` - Document version history
- `document_text_extraction` - Text extraction results
- `ai_processing` - AI processing jobs
- `ai_generated_tasks` - AI-suggested tasks
- `document_processing_queue` - Processing queue

### Calendar & Events
- `calendar_events` - Calendar events

### System Tables
- `user_sessions` - User sessions
- `audit_logs` - Audit logs

## Notes

- All tables use `utf8mb4` charset for full Unicode support
- Foreign keys are properly defined with appropriate constraints
- Indexes are created for commonly queried columns
- All timestamps use `CURRENT_TIMESTAMP` defaults

