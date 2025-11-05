-- =========================================================
-- SmartSprint MySQL 8.0 Complete Database Schema
-- Safe to run multiple times: uses IF NOT EXISTS where possible
-- Charset: utf8mb4 for full Unicode support
-- =========================================================

-- Create database (uncomment if needed)
-- CREATE DATABASE IF NOT EXISTS smarsprint CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
-- USE smarsprint;

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- SECTION 1: LOOKUP TABLES (Enum-like reference tables)
-- =========================================================

-- Roles lookup table
CREATE TABLE IF NOT EXISTS roles (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_key      VARCHAR(50) NOT NULL UNIQUE,
  name          VARCHAR(100) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Project status lookup table
CREATE TABLE IF NOT EXISTS project_status (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`  VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sprint status lookup table
CREATE TABLE IF NOT EXISTS sprint_status (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`  VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task status lookup table
CREATE TABLE IF NOT EXISTS task_status (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`  VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task priority lookup table
CREATE TABLE IF NOT EXISTS task_priority (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`  VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task type lookup table
CREATE TABLE IF NOT EXISTS task_type (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`  VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Dependency type lookup table
CREATE TABLE IF NOT EXISTS dependency_type (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`  VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Event type lookup table
CREATE TABLE IF NOT EXISTS event_type (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`  VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Event priority lookup table
CREATE TABLE IF NOT EXISTS event_priority (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`  VARCHAR(20) NOT NULL UNIQUE,
  name VARCHAR(40) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Event status lookup table
CREATE TABLE IF NOT EXISTS event_status (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`  VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Processing type lookup table (for AI/document processing)
CREATE TABLE IF NOT EXISTS processing_type (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`  VARCHAR(40) NOT NULL UNIQUE,
  name VARCHAR(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Processing status lookup table
CREATE TABLE IF NOT EXISTS processing_status (
  id   TINYINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  `key`  VARCHAR(30) NOT NULL UNIQUE,
  name VARCHAR(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- SECTION 2: CORE ENTITY TABLES
-- =========================================================

-- Companies table
CREATE TABLE IF NOT EXISTS companies (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(255) NOT NULL,
  domain           VARCHAR(100) UNIQUE,
  logo_url         VARCHAR(500),
  subscription_plan VARCHAR(50) DEFAULT 'free',
  max_users        INT DEFAULT 10,
  is_active        TINYINT(1) DEFAULT 1,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  KEY idx_companies_active (is_active),
  KEY idx_companies_domain (domain)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  email           VARCHAR(255) NOT NULL UNIQUE,
  password_hash   VARCHAR(255) NOT NULL,
  first_name      VARCHAR(100) NOT NULL,
  last_name       VARCHAR(100) NOT NULL,
  avatar_url      VARCHAR(500),
  role_id         BIGINT UNSIGNED,
  company_id      BIGINT UNSIGNED,
  is_active       TINYINT(1) DEFAULT 1,
  email_verified  TINYINT(1) DEFAULT 0,
  last_login      DATETIME,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id),
  CONSTRAINT fk_users_company FOREIGN KEY (company_id) REFERENCES companies(id),
  KEY idx_users_email (email),
  KEY idx_users_company_id (company_id),
  KEY idx_users_role_id (role_id),
  KEY idx_users_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  perm_key     VARCHAR(100) NOT NULL UNIQUE,
  name         VARCHAR(140) NOT NULL,
  category     VARCHAR(60) NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Role-Permission mapping table
CREATE TABLE IF NOT EXISTS role_has_permission (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id         BIGINT UNSIGNED NOT NULL,
  permission_id   BIGINT UNSIGNED NOT NULL,
  UNIQUE KEY uq_role_permission (role_id, permission_id),
  CONSTRAINT fk_rhp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_rhp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User-Permission mapping table (explicit user permissions)
CREATE TABLE IF NOT EXISTS user_permissions (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  permission_key  VARCHAR(100) NOT NULL,
  granted         TINYINT(1) DEFAULT 0,
  granted_by      BIGINT UNSIGNED,
  granted_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_user_permission UNIQUE (user_id, permission_key),
  CONSTRAINT fk_user_permissions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_permissions_granted_by FOREIGN KEY (granted_by) REFERENCES users(id),
  KEY idx_user_permissions_key (permission_key)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Projects table
CREATE TABLE IF NOT EXISTS projects (
  id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name                VARCHAR(255) NOT NULL,
  description         TEXT,
  company_id          BIGINT UNSIGNED,
  project_manager_id  BIGINT UNSIGNED,
  status_id           TINYINT UNSIGNED,
  start_date          DATE,
  end_date            DATE,
  budget              DECIMAL(15,2),
  created_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_projects_company FOREIGN KEY (company_id) REFERENCES companies(id),
  CONSTRAINT fk_projects_manager FOREIGN KEY (project_manager_id) REFERENCES users(id),
  CONSTRAINT fk_projects_status FOREIGN KEY (status_id) REFERENCES project_status(id),
  KEY idx_projects_company_id (company_id),
  KEY idx_projects_manager_id (project_manager_id),
  KEY idx_projects_status_id (status_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- User-Project mapping table (project members)
CREATE TABLE IF NOT EXISTS user_projects (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id    BIGINT UNSIGNED NOT NULL,
  project_id BIGINT UNSIGNED NOT NULL,
  role       VARCHAR(50) DEFAULT 'member',
  joined_at  TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_user_project UNIQUE (user_id, project_id),
  CONSTRAINT fk_user_projects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_user_projects_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  KEY idx_user_projects_user_id (user_id),
  KEY idx_user_projects_project_id (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Sprints table
CREATE TABLE IF NOT EXISTS sprints (
  id               BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  name             VARCHAR(255) NOT NULL,
  description      TEXT,
  project_id       BIGINT UNSIGNED,
  goal             TEXT,
  start_date       DATE NOT NULL,
  end_date         DATE NOT NULL,
  status_id        TINYINT UNSIGNED,
  capacity_hours   DECIMAL(8,2) DEFAULT 0,
  velocity_points  DECIMAL(8,2) DEFAULT 0,
  created_by       BIGINT UNSIGNED,
  created_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_sprints_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_sprints_status FOREIGN KEY (status_id) REFERENCES sprint_status(id),
  CONSTRAINT fk_sprints_created_by FOREIGN KEY (created_by) REFERENCES users(id),
  KEY idx_sprints_project_id (project_id),
  KEY idx_sprints_status_id (status_id),
  KEY idx_sprints_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- SECTION 3: TASK MANAGEMENT TABLES
-- =========================================================

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id                   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title                VARCHAR(500) NOT NULL,
  description          TEXT,
  project_id           BIGINT UNSIGNED,
  sprint_id            BIGINT UNSIGNED,
  status_id            TINYINT UNSIGNED,
  priority_id          TINYINT UNSIGNED,
  task_type_id         TINYINT UNSIGNED,
  assignee_id          BIGINT UNSIGNED,
  reviewer_id          BIGINT UNSIGNED,
  due_date             DATETIME,
  estimated_hours      DECIMAL(5,2),
  actual_hours         DECIMAL(5,2),
  progress_percentage  INT DEFAULT 0,
  created_by           BIGINT UNSIGNED,
  created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_tasks_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_tasks_sprint FOREIGN KEY (sprint_id) REFERENCES sprints(id),
  CONSTRAINT fk_tasks_status FOREIGN KEY (status_id) REFERENCES task_status(id),
  CONSTRAINT fk_tasks_priority FOREIGN KEY (priority_id) REFERENCES task_priority(id),
  CONSTRAINT fk_tasks_type FOREIGN KEY (task_type_id) REFERENCES task_type(id),
  CONSTRAINT fk_tasks_assignee FOREIGN KEY (assignee_id) REFERENCES users(id),
  CONSTRAINT fk_tasks_reviewer FOREIGN KEY (reviewer_id) REFERENCES users(id),
  CONSTRAINT fk_tasks_created_by FOREIGN KEY (created_by) REFERENCES users(id),
  KEY idx_tasks_project_id (project_id),
  KEY idx_tasks_sprint_id (sprint_id),
  KEY idx_tasks_assignee_id (assignee_id),
  KEY idx_tasks_status_id (status_id),
  KEY idx_tasks_priority_id (priority_id),
  KEY idx_tasks_type_id (task_type_id),
  KEY idx_tasks_due_date (due_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task dependencies table
CREATE TABLE IF NOT EXISTS task_dependencies (
  id                   BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id              BIGINT UNSIGNED NOT NULL,
  depends_on_task_id   BIGINT UNSIGNED NOT NULL,
  dependency_type_id   TINYINT UNSIGNED,
  created_at           TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_task_dep_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_dep_depends_on FOREIGN KEY (depends_on_task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_dep_type FOREIGN KEY (dependency_type_id) REFERENCES dependency_type(id),
  KEY idx_task_dependencies_task_id (task_id),
  KEY idx_task_dependencies_depends_on (depends_on_task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task attachments table
CREATE TABLE IF NOT EXISTS task_attachments (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id       BIGINT UNSIGNED NOT NULL,
  file_name     VARCHAR(255) NOT NULL,
  file_path     VARCHAR(500) NOT NULL,
  file_size     BIGINT NOT NULL,
  mime_type     VARCHAR(100),
  uploaded_by   BIGINT UNSIGNED,
  uploaded_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_task_attachments_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_attachments_user FOREIGN KEY (uploaded_by) REFERENCES users(id),
  KEY idx_task_attachments_task_id (task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task assignees table (many-to-many relationship)
CREATE TABLE IF NOT EXISTS task_assignees (
  id         BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id    BIGINT UNSIGNED NOT NULL,
  user_id    BIGINT UNSIGNED NOT NULL,
  assigned_by BIGINT UNSIGNED,
  assigned_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_task_assignee UNIQUE (task_id, user_id),
  CONSTRAINT fk_task_assignees_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_assignees_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_assignees_assigned_by FOREIGN KEY (assigned_by) REFERENCES users(id),
  KEY idx_task_assignees_task_id (task_id),
  KEY idx_task_assignees_user_id (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Task links table
CREATE TABLE IF NOT EXISTS task_links (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  task_id       BIGINT UNSIGNED NOT NULL,
  url           VARCHAR(500) NOT NULL,
  title         VARCHAR(255),
  description   TEXT,
  link_type     VARCHAR(50) DEFAULT 'external',
  created_by    BIGINT UNSIGNED,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_task_links_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_task_links_created_by FOREIGN KEY (created_by) REFERENCES users(id),
  KEY idx_task_links_task_id (task_id),
  KEY idx_task_links_created_by (created_by)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Comments table (supports nested comments via parent_comment_id)
CREATE TABLE IF NOT EXISTS comments (
  id                 BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  content            TEXT NOT NULL,
  task_id            BIGINT UNSIGNED NOT NULL,
  parent_comment_id  BIGINT UNSIGNED NULL,
  author_id          BIGINT UNSIGNED,
  is_edited          TINYINT(1) DEFAULT 0,
  edited_at          DATETIME,
  created_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at         TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_task FOREIGN KEY (task_id) REFERENCES tasks(id) ON DELETE CASCADE,
  CONSTRAINT fk_comments_parent FOREIGN KEY (parent_comment_id) REFERENCES comments(id),
  CONSTRAINT fk_comments_author FOREIGN KEY (author_id) REFERENCES users(id),
  KEY idx_comments_task_id (task_id),
  KEY idx_comments_author_id (author_id),
  KEY idx_comments_parent_id (parent_comment_id),
  KEY idx_comments_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- SECTION 4: DOCUMENT MANAGEMENT TABLES
-- =========================================================

-- Documents table
CREATE TABLE IF NOT EXISTS documents (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  file_name     VARCHAR(255) NOT NULL,
  file_path     VARCHAR(500) NOT NULL,
  file_size     BIGINT NOT NULL,
  mime_type     VARCHAR(100),
  project_id    BIGINT UNSIGNED,
  uploaded_by   BIGINT UNSIGNED,
  is_processed  TINYINT(1) DEFAULT 0,
  extracted_text LONGTEXT,
  text_extracted_at DATETIME,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_documents_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
  CONSTRAINT fk_documents_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id),
  KEY idx_documents_project_id (project_id),
  KEY idx_documents_uploaded_by (uploaded_by),
  KEY idx_documents_processed (is_processed),
  KEY idx_documents_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Document versions table
CREATE TABLE IF NOT EXISTS document_versions (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  document_id       BIGINT UNSIGNED NOT NULL,
  version_number    INT NOT NULL,
  file_path         VARCHAR(500) NOT NULL,
  file_size         BIGINT NOT NULL,
  change_description TEXT,
  uploaded_by       BIGINT UNSIGNED,
  uploaded_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_document_version UNIQUE (document_id, version_number),
  CONSTRAINT fk_document_versions_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  CONSTRAINT fk_document_versions_uploaded_by FOREIGN KEY (uploaded_by) REFERENCES users(id),
  KEY idx_document_versions_document_id (document_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Document text extraction table
CREATE TABLE IF NOT EXISTS document_text_extraction (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  document_id       BIGINT UNSIGNED NOT NULL,
  extraction_method VARCHAR(50),
  raw_text          LONGTEXT,
  structured_data   JSON,
  page_count        INT,
  word_count        INT,
  character_count   INT,
  extraction_metadata JSON,
  error_message     TEXT,
  extracted_at      DATETIME NOT NULL,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_text_extraction_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  KEY idx_text_extraction_document_id (document_id),
  KEY idx_text_extraction_extracted_at (extracted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI processing table
CREATE TABLE IF NOT EXISTS ai_processing (
  id                       BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  document_id              BIGINT UNSIGNED NOT NULL,
  processing_type_id       TINYINT UNSIGNED NOT NULL,
  status_id                TINYINT UNSIGNED DEFAULT NULL,
  input_data               JSON,
  output_data              JSON,
  extracted_tasks          JSON,
  summary                  TEXT,
  confidence_score         DECIMAL(3,2),
  processing_started_at    DATETIME,
  processing_completed_at  DATETIME,
  error_message            TEXT,
  created_at               TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_processing_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  CONSTRAINT fk_ai_processing_type FOREIGN KEY (processing_type_id) REFERENCES processing_type(id),
  CONSTRAINT fk_ai_processing_status FOREIGN KEY (status_id) REFERENCES processing_status(id),
  KEY idx_ai_processing_document_id (document_id),
  KEY idx_ai_processing_status_id (status_id),
  KEY idx_ai_processing_type_id (processing_type_id),
  KEY idx_ai_processing_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- AI generated tasks table
CREATE TABLE IF NOT EXISTS ai_generated_tasks (
  id                        BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  ai_processing_id          BIGINT UNSIGNED NOT NULL,
  suggested_title           VARCHAR(500) NOT NULL,
  suggested_description     TEXT,
  suggested_priority_id     TINYINT UNSIGNED,
  suggested_task_type_id    TINYINT UNSIGNED,
  suggested_assignee_id     BIGINT UNSIGNED,
  suggested_due_date        DATETIME,
  confidence_score          DECIMAL(3,2),
  is_accepted               TINYINT(1) DEFAULT 0,
  accepted_by                BIGINT UNSIGNED,
  accepted_at               DATETIME,
  created_task_id           BIGINT UNSIGNED,
  created_at                TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_ai_gen_tasks_processing FOREIGN KEY (ai_processing_id) REFERENCES ai_processing(id) ON DELETE CASCADE,
  CONSTRAINT fk_ai_gen_tasks_priority FOREIGN KEY (suggested_priority_id) REFERENCES task_priority(id),
  CONSTRAINT fk_ai_gen_tasks_type FOREIGN KEY (suggested_task_type_id) REFERENCES task_type(id),
  CONSTRAINT fk_ai_gen_tasks_assignee FOREIGN KEY (suggested_assignee_id) REFERENCES users(id),
  CONSTRAINT fk_ai_gen_tasks_accepted_by FOREIGN KEY (accepted_by) REFERENCES users(id),
  CONSTRAINT fk_ai_gen_tasks_created_task FOREIGN KEY (created_task_id) REFERENCES tasks(id),
  KEY idx_ai_generated_tasks_processing_id (ai_processing_id),
  KEY idx_ai_generated_tasks_accepted (is_accepted),
  KEY idx_ai_generated_tasks_created_task_id (created_task_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Document processing queue table
CREATE TABLE IF NOT EXISTS document_processing_queue (
  id                BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  document_id       BIGINT UNSIGNED NOT NULL,
  processing_stage  VARCHAR(50) NOT NULL,
  priority          INT DEFAULT 5,
  status            VARCHAR(20) DEFAULT 'pending',
  attempts          INT DEFAULT 0,
  max_attempts       INT DEFAULT 3,
  error_message     TEXT,
  scheduled_at      DATETIME,
  started_at        DATETIME,
  completed_at      DATETIME,
  created_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at        TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_processing_queue_document FOREIGN KEY (document_id) REFERENCES documents(id) ON DELETE CASCADE,
  KEY idx_processing_queue_document_id (document_id),
  KEY idx_processing_queue_status (status),
  KEY idx_processing_queue_scheduled_at (scheduled_at),
  KEY idx_processing_queue_priority (priority)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- SECTION 5: CALENDAR & EVENTS TABLES
-- =========================================================

-- Calendar events table
CREATE TABLE IF NOT EXISTS calendar_events (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  title         VARCHAR(255) NOT NULL,
  description   TEXT,
  event_type_id TINYINT UNSIGNED NOT NULL,
  start_date    DATETIME NOT NULL,
  end_date      DATETIME NOT NULL,
  is_all_day    TINYINT(1) DEFAULT 0,
  priority_id   TINYINT UNSIGNED,
  status_id     TINYINT UNSIGNED,
  project_id    BIGINT UNSIGNED,
  sprint_id     BIGINT UNSIGNED,
  task_id       BIGINT UNSIGNED,
  created_by    BIGINT UNSIGNED,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_events_type FOREIGN KEY (event_type_id) REFERENCES event_type(id),
  CONSTRAINT fk_events_priority FOREIGN KEY (priority_id) REFERENCES event_priority(id),
  CONSTRAINT fk_events_status FOREIGN KEY (status_id) REFERENCES event_status(id),
  CONSTRAINT fk_events_project FOREIGN KEY (project_id) REFERENCES projects(id),
  CONSTRAINT fk_events_sprint FOREIGN KEY (sprint_id) REFERENCES sprints(id),
  CONSTRAINT fk_events_task FOREIGN KEY (task_id) REFERENCES tasks(id),
  CONSTRAINT fk_events_created_by FOREIGN KEY (created_by) REFERENCES users(id),
  KEY idx_events_project_id (project_id),
  KEY idx_events_sprint_id (sprint_id),
  KEY idx_events_task_id (task_id),
  KEY idx_events_dates (start_date, end_date),
  KEY idx_events_type_id (event_type_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- =========================================================
-- SECTION 6: SYSTEM TABLES
-- =========================================================

-- User sessions table
CREATE TABLE IF NOT EXISTS user_sessions (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  token_hash      VARCHAR(255) NOT NULL,
  expires_at      DATETIME NOT NULL,
  ip_address      VARCHAR(45),
  user_agent      TEXT,
  is_active       TINYINT(1) DEFAULT 1,
  created_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  last_accessed_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_user_sessions_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  KEY idx_user_sessions_user_id (user_id),
  KEY idx_user_sessions_token_hash (token_hash),
  KEY idx_user_sessions_expires_at (expires_at),
  KEY idx_user_sessions_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Audit logs table
CREATE TABLE IF NOT EXISTS audit_logs (
  id             BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id        BIGINT UNSIGNED,
  action         VARCHAR(100) NOT NULL,
  resource_type  VARCHAR(50) NOT NULL,
  resource_id    BIGINT UNSIGNED NULL,
  old_values     JSON,
  new_values     JSON,
  ip_address     VARCHAR(45),
  user_agent     TEXT,
  created_at     TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_audit_logs_user FOREIGN KEY (user_id) REFERENCES users(id),
  KEY idx_audit_logs_user_id (user_id),
  KEY idx_audit_logs_action (action),
  KEY idx_audit_logs_resource (resource_type, resource_id),
  KEY idx_audit_logs_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- Schema creation complete!
-- Run seed.sql to populate initial data
-- =========================================================

