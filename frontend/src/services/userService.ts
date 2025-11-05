import { BASE_URL, handleJson } from './base';
export interface Permissions {
  // Task Management
  canCreateTasks: boolean;
  canAssignTasks: boolean;
  canEditTasks: boolean;
  canDeleteTasks: boolean;
  canChangeDeadlines: boolean;
  canChangePriority: boolean;
  canChangeStatus: boolean;
  
  // Task Visibility
  canSeeAllTasks: boolean;
  canSeeFETasks: boolean;
  canSeeBETasks: boolean;
  canSeeDesignTasks: boolean;
  canSeeTestTasks: boolean;
  canSeeDevOpsTasks: boolean;
  canSeeDataTasks: boolean;
  canSeeProductTasks: boolean;
  
  // Team Management
  canAddTeamMembers: boolean;
  canRemoveTeamMembers: boolean;
  canChangeUserRoles: boolean;
  canViewAllTeamMembers: boolean;
  
  // Project Management
  canCreateProjects: boolean;
  canEditProjects: boolean;
  canDeleteProjects: boolean;
  canViewAllProjects: boolean;
  canViewProjectOverview: boolean;
  canEditProjectSettings: boolean;
  canCreateSprints: boolean;
  canManageSprints: boolean;
  canManageProjectMembers: boolean;
  
  // Documentation
  canUploadDocuments: boolean;
  canDeleteDocuments: boolean;
  canViewAllDocuments: boolean;
  
  // Meetings
  canCreateMeetings: boolean;
  canEditMeetings: boolean;
  canDeleteMeetings: boolean;
  canViewAllMeetings: boolean;
  
  // Analytics & Reporting
  canViewAllMetrics: boolean;
  canGenerateReports: boolean;
  canExportData: boolean;
  
  // Comments & Communication
  canAddComments: boolean;
  canEditComments: boolean;
  canDeleteComments: boolean;
  canViewAllComments: boolean;
  
  // Special Permissions
  canManagePermissions: boolean;
  canAccessAdminPanel: boolean;
  canViewUserActivity: boolean;
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: UserRole;
  company: string;
  permissions: Permissions;
  avatar: string;
  isActive: boolean;
  createdAt: string;
  lastLogin: string;
}

export type UserRole = 
  | 'admin'
  | 'project-manager'
  | 'frontend-developer'
  | 'backend-developer'
  | 'fullstack-developer'
  | 'qa-tester'
  | 'devops-engineer'
  | 'ui-ux-designer'
  | 'data-analyst'
  | 'product-manager'
  | 'scrum-master'
  | 'technical-lead'
  | 'other';

// ============================================================================
// User API Types
// ============================================================================
export type UserDetailDto = {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  role_key: string | null;
  role_name: string | null;
  avatar_url: string | null;
  company_id: number | null;
  is_active: boolean;
  email_verified: boolean;
  last_login: string | null;
  created_at: string;
  updated_at: string;
};

export type UserUpdatePayload = {
  first_name?: string;
  last_name?: string;
  email?: string;
  role?: string; // role_key
  avatar_url?: string | null;
  is_active?: boolean;
  email_verified?: boolean;
};

export type UserPermissionDetailDto = {
  permission_key: string;
  permission_name: string;
  category: string;
  granted: boolean;
  source: 'role' | 'explicit';
};

export type UserPermissionsDto = {
  user_id: number;
  role_permissions: UserPermissionDetailDto[];
  explicit_permissions: UserPermissionDetailDto[];
};

export type UserPermissionUpdatePayload = {
  permission_key: string;
  granted: boolean;
};

export type RegisterPayload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string; // role_key
  avatar_url: string | null;
};


// Default permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permissions> = {
  'admin': {
    canCreateTasks: true,
    canAssignTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canChangeDeadlines: true,
    canChangePriority: true,
    canChangeStatus: true,
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    canAddTeamMembers: true,
    canRemoveTeamMembers: true,
    canChangeUserRoles: true,
    canViewAllTeamMembers: true,
    canCreateProjects: true,
    canEditProjects: true,
    canDeleteProjects: true,
    canViewAllProjects: true,
    canViewProjectOverview: true,
    canEditProjectSettings: true,
    canCreateSprints: true,
    canManageSprints: true,
    canManageProjectMembers: true,
    canUploadDocuments: true,
    canDeleteDocuments: true,
    canViewAllDocuments: true,
    canCreateMeetings: true,
    canEditMeetings: true,
    canDeleteMeetings: true,
    canViewAllMeetings: true,
    canViewAllMetrics: true,
    canGenerateReports: true,
    canExportData: true,
    canAddComments: true,
    canEditComments: true,
    canDeleteComments: true,
    canViewAllComments: true,
    canManagePermissions: true,
    canAccessAdminPanel: true,
    canViewUserActivity: true,
  },
  'project-manager': {
    canCreateTasks: true,
    canAssignTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canChangeDeadlines: true,
    canChangePriority: true,
    canChangeStatus: true,
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    canAddTeamMembers: true,
    canRemoveTeamMembers: true,
    canChangeUserRoles: true,
    canViewAllTeamMembers: true,
    canCreateProjects: true,
    canEditProjects: true,
    canDeleteProjects: true,
    canViewAllProjects: true,
    canViewProjectOverview: true,
    canEditProjectSettings: true,
    canCreateSprints: true,
    canManageSprints: true,
    canManageProjectMembers: true,
    canUploadDocuments: true,
    canDeleteDocuments: true,
    canViewAllDocuments: true,
    canCreateMeetings: true,
    canEditMeetings: true,
    canDeleteMeetings: true,
    canViewAllMeetings: true,
    canViewAllMetrics: true,
    canGenerateReports: true,
    canExportData: true,
    canAddComments: true,
    canEditComments: true,
    canDeleteComments: true,
    canViewAllComments: true,
    canManagePermissions: true,
    canAccessAdminPanel: true,
    canViewUserActivity: true,
  },
  'frontend-developer': {
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    canSeeAllTasks: false,
    canSeeFETasks: true,
    canSeeBETasks: false,
    canSeeDesignTasks: true,
    canSeeTestTasks: false,
    canSeeDevOpsTasks: false,
    canSeeDataTasks: false,
    canSeeProductTasks: false,
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canViewAllProjects: false,
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    canManageProjectMembers: false,
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  'backend-developer': {
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    canSeeAllTasks: false,
    canSeeFETasks: false,
    canSeeBETasks: true,
    canSeeDesignTasks: false,
    canSeeTestTasks: false,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: false,
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canViewAllProjects: false,
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    canManageProjectMembers: false,
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  'fullstack-developer': {
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canViewAllProjects: false,
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    canManageProjectMembers: false,
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  'qa-tester': {
    canCreateTasks: true,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canViewAllProjects: false,
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    canManageProjectMembers: false,
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  'devops-engineer': {
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    canSeeAllTasks: false,
    canSeeFETasks: false,
    canSeeBETasks: false,
    canSeeDesignTasks: false,
    canSeeTestTasks: false,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: false,
    canSeeProductTasks: false,
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canViewAllProjects: false,
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    canManageProjectMembers: false,
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  'ui-ux-designer': {
    canCreateTasks: true,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    canSeeAllTasks: false,
    canSeeFETasks: true,
    canSeeBETasks: false,
    canSeeDesignTasks: true,
    canSeeTestTasks: false,
    canSeeDevOpsTasks: false,
    canSeeDataTasks: false,
    canSeeProductTasks: true,
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canViewAllProjects: false,
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    canManageProjectMembers: false,
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  'data-analyst': {
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    canSeeAllTasks: false,
    canSeeFETasks: false,
    canSeeBETasks: false,
    canSeeDesignTasks: false,
    canSeeTestTasks: false,
    canSeeDevOpsTasks: false,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canViewAllProjects: false,
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    canManageProjectMembers: false,
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    canViewAllMetrics: true,
    canGenerateReports: true,
    canExportData: true,
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  'product-manager': {
    canCreateTasks: true,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canViewAllProjects: false,
    canViewProjectOverview: true,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    canManageProjectMembers: false,
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  'scrum-master': {
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canViewAllProjects: false,
    canViewProjectOverview: true,
    canEditProjectSettings: false,
    canCreateSprints: true,
    canManageSprints: true,
    canManageProjectMembers: false,
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    canCreateMeetings: true,
    canEditMeetings: true,
    canDeleteMeetings: true,
    canViewAllMeetings: true,
    canViewAllMetrics: true,
    canGenerateReports: false,
    canExportData: false,
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  'technical-lead': {
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canViewAllProjects: false,
    canViewProjectOverview: true,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    canManageProjectMembers: false,
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  'other': {
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: false,
    canSeeAllTasks: false,
    canSeeFETasks: false,
    canSeeBETasks: false,
    canSeeDesignTasks: false,
    canSeeTestTasks: false,
    canSeeDevOpsTasks: false,
    canSeeDataTasks: false,
    canSeeProductTasks: false,
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    canCreateProjects: false,
    canEditProjects: false,
    canDeleteProjects: false,
    canViewAllProjects: false,
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    canManageProjectMembers: false,
    canUploadDocuments: false,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    canAddComments: false,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
};

// Helper function to get permissions for a role
export const getPermissionsForRole = (role: UserRole | string): Permissions => {
  if (!(role in ROLE_PERMISSIONS)) {
    return ROLE_PERMISSIONS['other'];
  }
  return ROLE_PERMISSIONS[role as UserRole];
};

// Helper function to check if user has specific permission
export const hasPermission = (user: User, permission: keyof Permissions): boolean => {
  return user.permissions[permission];
};

// Helper function to check if user can see a specific task type
export const canSeeTaskType = (user: User, taskType: string): boolean => {
  switch (taskType.toLowerCase()) {
    case 'frontend':
    case 'ui':
    case 'ux':
      return user.permissions.canSeeFETasks || user.permissions.canSeeAllTasks;
    case 'backend':
    case 'api':
    case 'database':
      return user.permissions.canSeeBETasks || user.permissions.canSeeAllTasks;
    case 'design':
      return user.permissions.canSeeDesignTasks || user.permissions.canSeeAllTasks;
    case 'test':
    case 'qa':
      return user.permissions.canSeeTestTasks || user.permissions.canSeeAllTasks;
    case 'devops':
    case 'deployment':
      return user.permissions.canSeeDevOpsTasks || user.permissions.canSeeAllTasks;
    case 'data':
    case 'analytics':
      return user.permissions.canSeeDataTasks || user.permissions.canSeeAllTasks;
    case 'product':
      return user.permissions.canSeeProductTasks || user.permissions.canSeeAllTasks;
    default:
      return user.permissions.canSeeAllTasks;
  }
};

// ============================================================================
// Users API
// ============================================================================
export async function getUsers(params?: {
  skip?: number;
  limit?: number;
  is_active?: boolean;
  role_key?: string;
}): Promise<UserDetailDto[]> {
  const queryParams = new URLSearchParams();
  if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
  if (params?.is_active !== undefined) queryParams.append('is_active', params.is_active.toString());
  if (params?.role_key) queryParams.append('role_key', params.role_key);
  
  const url = `${BASE_URL}/api/users${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  const res = await fetch(url);
  return handleJson<UserDetailDto[]>(res);
}

export async function getUser(userId: number): Promise<UserDetailDto> {
  const res = await fetch(`${BASE_URL}/api/users/${userId}`);
  return handleJson<UserDetailDto>(res);
}

export async function updateUser(userId: number, payload: UserUpdatePayload): Promise<UserDetailDto> {
  const res = await fetch(`${BASE_URL}/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleJson<UserDetailDto>(res);
}

// User Permissions API
export async function getUserPermissions(userId: number): Promise<UserPermissionsDto> {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/permissions`);
  return handleJson<UserPermissionsDto>(res);
}

export async function updateUserPermission(
  userId: number,
  permissionKey: string,
  payload: UserPermissionUpdatePayload
): Promise<UserPermissionsDto> {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/permissions/${permissionKey}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleJson<UserPermissionsDto>(res);
}

export async function deleteUserPermission(
  userId: number,
  permissionKey: string
): Promise<UserPermissionsDto> {
  const res = await fetch(`${BASE_URL}/api/users/${userId}/permissions/${permissionKey}`, {
    method: 'DELETE',
  });
  return handleJson<UserPermissionsDto>(res);
}

// Registration API
export async function registerUser(payload: RegisterPayload) {
  const res = await fetch(`${BASE_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleJson(res);
}
