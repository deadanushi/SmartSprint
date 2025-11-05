-- =========================================================
-- SmartSprint Database Seed Data
-- Populates lookup tables and creates initial admin user
-- Safe to run multiple times: uses ON DUPLICATE KEY UPDATE
-- =========================================================

SET FOREIGN_KEY_CHECKS = 0;

-- =========================================================
-- SECTION 1: ROLES
-- =========================================================

INSERT INTO roles (role_key, name) VALUES
  ('admin', 'Administrator'),
  ('project-manager', 'Project Manager'),
  ('frontend-developer', 'Frontend Developer'),
  ('backend-developer', 'Backend Developer'),
  ('fullstack-developer', 'Full Stack Developer'),
  ('qa-tester', 'QA Tester'),
  ('devops-engineer', 'DevOps Engineer'),
  ('ui-ux-designer', 'UI/UX Designer'),
  ('data-analyst', 'Data Analyst'),
  ('product-manager', 'Product Manager'),
  ('scrum-master', 'Scrum Master'),
  ('technical-lead', 'Technical Lead'),
  ('other', 'Other')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =========================================================
-- SECTION 2: PERMISSIONS
-- =========================================================

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
  ('canCreateProjects', 'Create projects', 'project'),
  ('canEditProjects', 'Edit projects', 'project'),
  ('canDeleteProjects', 'Delete projects', 'project'),
  ('canViewAllProjects', 'View all projects', 'project'),
  ('canViewProjectOverview', 'View project overview', 'project'),
  ('canEditProjectSettings', 'Edit project settings', 'project'),
  ('canCreateSprints', 'Create sprints', 'project'),
  ('canManageSprints', 'Manage sprints', 'project'),
  ('canManageProjectMembers', 'Manage project members', 'project'),

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

-- =========================================================
-- SECTION 3: GRANT ALL PERMISSIONS TO ADMIN ROLE
-- =========================================================

INSERT INTO role_has_permission (role_id, permission_id)
SELECT r.id, p.id
FROM roles r CROSS JOIN permissions p
WHERE r.role_key = 'admin'
ON DUPLICATE KEY UPDATE role_id = VALUES(role_id), permission_id = VALUES(permission_id);

-- =========================================================
-- SECTION 4: PROJECT STATUS
-- =========================================================

INSERT INTO project_status (`key`, name) VALUES
  ('planning', 'Planning'),
  ('active', 'Active'),
  ('on-hold', 'On Hold'),
  ('completed', 'Completed'),
  ('cancelled', 'Cancelled')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =========================================================
-- SECTION 5: SPRINT STATUS
-- =========================================================

INSERT INTO sprint_status (`key`, name) VALUES
  ('planning', 'Planning'),
  ('active', 'Active'),
  ('completed', 'Completed'),
  ('cancelled', 'Cancelled')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =========================================================
-- SECTION 6: TASK STATUS
-- =========================================================

INSERT INTO task_status (`key`, name) VALUES
  ('to-do', 'To Do'),
  ('in-progress', 'In Progress'),
  ('waiting-review', 'Waiting Review'),
  ('testing', 'Testing'),
  ('done', 'Done')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =========================================================
-- SECTION 7: TASK PRIORITY
-- =========================================================

INSERT INTO task_priority (`key`, name) VALUES
  ('low', 'Low'),
  ('medium', 'Medium'),
  ('high', 'High')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =========================================================
-- SECTION 8: TASK TYPE
-- =========================================================

INSERT INTO task_type (`key`, name) VALUES
  ('frontend', 'Frontend'),
  ('backend', 'Backend'),
  ('design', 'Design'),
  ('test', 'Test'),
  ('devops', 'DevOps'),
  ('data', 'Data'),
  ('product', 'Product')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =========================================================
-- SECTION 9: DEPENDENCY TYPE
-- =========================================================

INSERT INTO dependency_type (`key`, name) VALUES
  ('blocks', 'Blocks'),
  ('relates-to', 'Relates To'),
  ('duplicates', 'Duplicates')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =========================================================
-- SECTION 10: EVENT TYPE
-- =========================================================

INSERT INTO event_type (`key`, name) VALUES
  ('sprint', 'Sprint'),
  ('planning', 'Planning'),
  ('review', 'Review'),
  ('retrospective', 'Retrospective'),
  ('task-deadline', 'Task Deadline'),
  ('meeting', 'Meeting'),
  ('milestone', 'Milestone'),
  ('release', 'Release'),
  ('holiday', 'Holiday'),
  ('devops', 'DevOps')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =========================================================
-- SECTION 11: EVENT PRIORITY
-- =========================================================

INSERT INTO event_priority (`key`, name) VALUES
  ('low', 'Low'),
  ('medium', 'Medium'),
  ('high', 'High')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =========================================================
-- SECTION 12: EVENT STATUS
-- =========================================================

INSERT INTO event_status (`key`, name) VALUES
  ('upcoming', 'Upcoming'),
  ('in-progress', 'In Progress'),
  ('completed', 'Completed'),
  ('cancelled', 'Cancelled')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =========================================================
-- SECTION 13: PROCESSING TYPE
-- =========================================================

INSERT INTO processing_type (`key`, name) VALUES
  ('text-extraction', 'Text Extraction'),
  ('task-detection', 'Task Detection'),
  ('summarization', 'Summarization'),
  ('classification', 'Classification'),
  ('sentiment-analysis', 'Sentiment Analysis'),
  ('pipeline-extraction', 'Pipeline Extraction')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =========================================================
-- SECTION 14: PROCESSING STATUS
-- =========================================================

INSERT INTO processing_status (`key`, name) VALUES
  ('pending', 'Pending'),
  ('processing', 'Processing'),
  ('completed', 'Completed'),
  ('failed', 'Failed'),
  ('retrying', 'Retrying')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- =========================================================
-- SECTION 15: CREATE ADMIN USER
-- =========================================================

INSERT INTO users (email, password_hash, first_name, last_name, role_id, is_active, email_verified)
SELECT 'admin@example.com', 'admin123', 'System', 'Admin', r.id, 1, 1
FROM roles r
WHERE r.role_key = 'admin'
  AND NOT EXISTS (SELECT 1 FROM users WHERE email = 'admin@example.com');

-- =========================================================
-- SECTION 16: GRANT ALL PERMISSIONS TO ADMIN USER
-- =========================================================

INSERT INTO user_permissions (user_id, permission_key, granted, granted_at)
SELECT u.id, p.perm_key, 1, CURRENT_TIMESTAMP
FROM users u CROSS JOIN permissions p
WHERE u.email = 'admin@example.com'
ON DUPLICATE KEY UPDATE granted = VALUES(granted), granted_at = VALUES(granted_at);

SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================
-- Seed data complete!
-- Admin user: admin@example.com / admin123
-- Admin role has all permissions via role_has_permission table
-- Admin user has all permissions via user_permissions table
-- =========================================================

