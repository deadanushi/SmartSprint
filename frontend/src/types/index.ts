// Task Types
export type {
  TaskDto,
  TaskAssigneeDto,
  TaskCreatePayload,
  TaskUpdatePayload,
  TaskStatusOption,
  TaskPriorityOption,
  TaskTypeOption,
} from '../services/taskService';

// Project Types
export type {
  ProjectDto,
  ProjectCreatePayload,
  ProjectUpdatePayload,
} from '../services/projectService';

// User Types
export type {
  UserDetailDto,
  UserUpdatePayload,
  UserPermissionDetailDto,
  UserPermissionsDto,
  UserPermissionUpdatePayload,
  RegisterPayload,
} from '../services/userService';

// Company Types
export type {
  CompanyDto,
} from '../services/companyService';

// Document Types
export type {
  DocumentDto,
  DocumentUploadPayload,
} from '../services/documentService';

// Role & Permission Types
export type {
  RoleDto,
  PermissionDto,
  RolePermissionsDto,
  RolePermissionsUpdatePayload,
} from '../services/roleService';

// Calendar Types
export type {
  CalendarEvent,
  Sprint,
  CalendarView,
  EventType,
} from '../services/calendarService';

// Permission Types (from userService)
export type {
  User,
  Permissions,
  UserRole,
} from '../services/userService';

// UI Types (for components)
export type {
  UITask,
  UIUser,
  UIColumn,
  UIBoardData,
} from './ui';

