
SET FOREIGN_KEY_CHECKS = 0;

-- 1) Create companies table
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

-- 2) Create roles table
CREATE TABLE IF NOT EXISTS roles (
  id            BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_key      VARCHAR(50) NOT NULL UNIQUE,
  name          VARCHAR(100) NOT NULL,
  created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3) Create users table (with role_id foreign key)
DROP TABLE IF EXISTS users;
CREATE TABLE users (
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

-- 4) Create permissions table
CREATE TABLE IF NOT EXISTS permissions (
  id           BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  perm_key     VARCHAR(100) NOT NULL UNIQUE,
  name         VARCHAR(140) NOT NULL,
  category     VARCHAR(60) NOT NULL,
  created_at   TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5) Create role_has_permission table (role -> permission mapping)
CREATE TABLE IF NOT EXISTS role_has_permission (
  id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
  role_id         BIGINT UNSIGNED NOT NULL,
  permission_id   BIGINT UNSIGNED NOT NULL,
  UNIQUE KEY uq_role_permission (role_id, permission_id),
  CONSTRAINT fk_rhp_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
  CONSTRAINT fk_rhp_permission FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6) Create user_permissions table (user -> permission mapping by string key)
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

-- 7) Seed permissions
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

-- 8) Seed roles
INSERT INTO roles (role_key, name) VALUES
  ('admin','Administrator'),
  ('project-manager','Project Manager'),
  ('frontend-developer','Frontend Developer'),
  ('backend-developer','Backend Developer'),
  ('fullstack-developer','Full Stack Developer'),
  ('qa-tester','QA Tester'),
  ('devops-engineer','DevOps Engineer'),
  ('ui-ux-designer','UI/UX Designer'),
  ('data-analyst','Data Analyst'),
  ('product-manager','Product Manager'),
  ('scrum-master','Scrum Master'),
  ('technical-lead','Technical Lead'),
  ('other','Other')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- 9) Create admin user (linked to admin role via role_id)
INSERT INTO users (email, password_hash, first_name, last_name, role_id, is_active, email_verified)
SELECT 'admin@example.com', 'admin123', 'System', 'Admin', r.id, 1, 1
FROM roles r
WHERE r.role_key = 'admin'
  AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');


-- 10) Grant ALL permissions to admin role (role_has_permission)
INSERT INTO role_has_permission (role_id, permission_id)
SELECT r.id, p.id
FROM roles r CROSS JOIN permissions p
WHERE r.role_key = 'admin'
ON DUPLICATE KEY UPDATE role_id = VALUES(role_id), permission_id = VALUES(permission_id);

-- 11) Grant ALL permissions to admin user (user_permissions)
INSERT INTO user_permissions (user_id, permission_key, granted, granted_at)
SELECT u.id, p.perm_key, 1, CURRENT_TIMESTAMP
FROM users u CROSS JOIN permissions p
WHERE u.email = 'admin@example.com'
ON DUPLICATE KEY UPDATE granted = VALUES(granted), granted_at = VALUES(granted_at);

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- Script complete!
-- Admin user: admin@example.com / admin123
-- Admin role has all permissions via role_has_permission table
-- Admin user has all permissions via user_permissions table
-- =========================================================
