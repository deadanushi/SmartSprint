-- Permissions schema and seed (MySQL 8.0)
-- Run this after creating the `taskflow` database and `users` table.
-- This script is idempotent: safe to run multiple times.

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- 1) Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  perm_key     VARCHAR(100) NOT NULL UNIQUE,
  name         VARCHAR(140) NOT NULL,
  category     VARCHAR(60) NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2) Replace/ensure user_permissions references permission_key by string (existing table)
-- If you prefer FK-based mapping, create an alternative table:
CREATE TABLE IF NOT EXISTS user_permissions_explicit (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  user_id         BIGINT UNSIGNED NOT NULL,
  permission_id   BIGINT UNSIGNED NOT NULL,
  granted         TINYINT(1) DEFAULT 1,
  granted_at      TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  UNIQUE KEY uq_user_perm (user_id, permission_id),
  CONSTRAINT fk_upe_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_upe_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) Seed all permissions (from frontend types/permissions.ts)
INSERT INTO permissions (perm_key, name, category) VALUES
  -- Task Management
  ('canCreateTasks', 'Create tasks', 'task'),
  ('canAssignTasks', 'Assign tasks', 'task'),
  ('canEditTasks', 'Edit tasks', 'task'),
  ('canDeleteTasks', 'Delete tasks', 'task'),
  ('canChangeDeadlines', 'Change task deadlines', 'task'),
  ('canChangePriority', 'Change task priority', 'task'),
  ('canChangeStatus', 'Change task status', 'task'),

  -- Task Visibility
  ('canSeeAllTasks', 'See all tasks', 'visibility'),
  ('canSeeFETasks', 'See frontend tasks', 'visibility'),
  ('canSeeBETasks', 'See backend tasks', 'visibility'),
  ('canSeeDesignTasks', 'See design tasks', 'visibility'),
  ('canSeeTestTasks', 'See test tasks', 'visibility'),
  ('canSeeDevOpsTasks', 'See DevOps tasks', 'visibility'),
  ('canSeeDataTasks', 'See data tasks', 'visibility'),
  ('canSeeProductTasks', 'See product tasks', 'visibility'),

  -- Team Management
  ('canAddTeamMembers', 'Add team members', 'team'),
  ('canRemoveTeamMembers', 'Remove team members', 'team'),
  ('canChangeUserRoles', 'Change user roles', 'team'),
  ('canViewAllTeamMembers', 'View all team members', 'team'),

  -- Project Management
  ('canViewProjectOverview', 'View project overview', 'project'),
  ('canEditProjectSettings', 'Edit project settings', 'project'),
  ('canCreateSprints', 'Create sprints', 'project'),
  ('canManageSprints', 'Manage sprints', 'project'),

  -- Documentation
  ('canUploadDocuments', 'Upload documents', 'docs'),
  ('canDeleteDocuments', 'Delete documents', 'docs'),
  ('canViewAllDocuments', 'View all documents', 'docs'),

  -- Meetings
  ('canCreateMeetings', 'Create meetings', 'meetings'),
  ('canEditMeetings', 'Edit meetings', 'meetings'),
  ('canDeleteMeetings', 'Delete meetings', 'meetings'),
  ('canViewAllMeetings', 'View all meetings', 'meetings'),

  -- Analytics & Reporting
  ('canViewAllMetrics', 'View all metrics', 'analytics'),
  ('canGenerateReports', 'Generate reports', 'analytics'),
  ('canExportData', 'Export data', 'analytics'),

  -- Comments & Communication
  ('canAddComments', 'Add comments', 'comments'),
  ('canEditComments', 'Edit comments', 'comments'),
  ('canDeleteComments', 'Delete comments', 'comments'),
  ('canViewAllComments', 'View all comments', 'comments'),

  -- Special Permissions
  ('canManagePermissions', 'Manage permissions', 'admin'),
  ('canAccessAdminPanel', 'Access admin panel', 'admin'),
  ('canViewUserActivity', 'View user activity', 'admin')
ON DUPLICATE KEY UPDATE name = VALUES(name), category = VALUES(category);

-- 4) Ensure an admin user exists (plain password for current phase)
INSERT INTO users (email, password_hash, first_name, last_name, role, is_active, email_verified)
SELECT 'admin@example.com', 'admin123', 'System', 'Admin', 'project-manager', 1, 1
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

-- 5) Grant ALL permissions to admin in both mapping styles
-- 5a) String-based mapping (existing user_permissions table)
INSERT INTO user_permissions (user_id, permission_key, granted, granted_at)
SELECT u.id, p.perm_key, 1, CURRENT_TIMESTAMP
FROM users u CROSS JOIN permissions p
WHERE u.email = 'admin@example.com'
ON DUPLICATE KEY UPDATE granted = VALUES(granted), granted_at = VALUES(granted_at);

-- 5b) FK-based mapping (user_permissions_explicit)
INSERT INTO user_permissions_explicit (user_id, permission_id, granted)
SELECT u.id, p.id, 1
FROM users u CROSS JOIN permissions p
WHERE u.email = 'admin@example.com'
ON DUPLICATE KEY UPDATE granted = VALUES(granted);

SET FOREIGN_KEY_CHECKS = 1;
