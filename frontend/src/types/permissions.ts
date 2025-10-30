// Permission types for role-based access control
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
  canViewProjectOverview: boolean;
  canEditProjectSettings: boolean;
  canCreateSprints: boolean;
  canManageSprints: boolean;
  
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

// Default permissions for each role
export const ROLE_PERMISSIONS: Record<UserRole, Permissions> = {
  'project-manager': {
    // Task Management - Full Access
    canCreateTasks: true,
    canAssignTasks: true,
    canEditTasks: true,
    canDeleteTasks: true,
    canChangeDeadlines: true,
    canChangePriority: true,
    canChangeStatus: true,
    
    // Task Visibility - All Tasks
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    
    // Team Management - Full Access
    canAddTeamMembers: true,
    canRemoveTeamMembers: true,
    canChangeUserRoles: true,
    canViewAllTeamMembers: true,
    
    // Project Management - Full Access
    canViewProjectOverview: true,
    canEditProjectSettings: true,
    canCreateSprints: true,
    canManageSprints: true,
    
    // Documentation - Full Access
    canUploadDocuments: true,
    canDeleteDocuments: true,
    canViewAllDocuments: true,
    
    // Meetings - Full Access
    canCreateMeetings: true,
    canEditMeetings: true,
    canDeleteMeetings: true,
    canViewAllMeetings: true,
    
    // Analytics - Full Access
    canViewAllMetrics: true,
    canGenerateReports: true,
    canExportData: true,
    
    // Comments - Full Access
    canAddComments: true,
    canEditComments: true,
    canDeleteComments: true,
    canViewAllComments: true,
    
    // Special Permissions - Admin Access
    canManagePermissions: true,
    canAccessAdminPanel: true,
    canViewUserActivity: true,
  },
  
  'frontend-developer': {
    // Task Management - Limited
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    
    // Task Visibility - Frontend Only
    canSeeAllTasks: false,
    canSeeFETasks: true,
    canSeeBETasks: false,
    canSeeDesignTasks: true,
    canSeeTestTasks: false,
    canSeeDevOpsTasks: false,
    canSeeDataTasks: false,
    canSeeProductTasks: false,
    
    // Team Management - None
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    
    // Project Management - None
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    
    // Documentation - Limited
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    
    // Meetings - None
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    
    // Analytics - None
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    
    // Comments - Limited
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    
    // Special Permissions - None
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  
  'backend-developer': {
    // Task Management - Limited
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    
    // Task Visibility - Backend Only
    canSeeAllTasks: false,
    canSeeFETasks: false,
    canSeeBETasks: true,
    canSeeDesignTasks: false,
    canSeeTestTasks: false,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: false,
    
    // Team Management - None
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    
    // Project Management - None
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    
    // Documentation - Limited
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    
    // Meetings - None
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    
    // Analytics - None
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    
    // Comments - Limited
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    
    // Special Permissions - None
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  
  'fullstack-developer': {
    // Task Management - Limited
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    
    // Task Visibility - All Tasks
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    
    // Team Management - None
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    
    // Project Management - None
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    
    // Documentation - Limited
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    
    // Meetings - None
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    
    // Analytics - None
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    
    // Comments - Limited
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    
    // Special Permissions - None
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  
  'qa-tester': {
    // Task Management - Limited
    canCreateTasks: true, // Can create bug reports
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    
    // Task Visibility - All Tasks (need to see what to test)
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    
    // Team Management - None
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    
    // Project Management - None
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    
    // Documentation - Limited
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    
    // Meetings - None
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    
    // Analytics - None
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    
    // Comments - Limited
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    
    // Special Permissions - None
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  
  'devops-engineer': {
    // Task Management - Limited
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    
    // Task Visibility - DevOps Only
    canSeeAllTasks: false,
    canSeeFETasks: false,
    canSeeBETasks: false,
    canSeeDesignTasks: false,
    canSeeTestTasks: false,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: false,
    canSeeProductTasks: false,
    
    // Team Management - None
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    
    // Project Management - None
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    
    // Documentation - Limited
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    
    // Meetings - None
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    
    // Analytics - None
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    
    // Comments - Limited
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    
    // Special Permissions - None
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  
  'ui-ux-designer': {
    // Task Management - Limited
    canCreateTasks: true, // Can create design tasks
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    
    // Task Visibility - Design Only
    canSeeAllTasks: false,
    canSeeFETasks: true,
    canSeeBETasks: false,
    canSeeDesignTasks: true,
    canSeeTestTasks: false,
    canSeeDevOpsTasks: false,
    canSeeDataTasks: false,
    canSeeProductTasks: true,
    
    // Team Management - None
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    
    // Project Management - None
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    
    // Documentation - Limited
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    
    // Meetings - None
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    
    // Analytics - None
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    
    // Comments - Limited
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    
    // Special Permissions - None
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  
  'data-analyst': {
    // Task Management - Limited
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    
    // Task Visibility - Data Only
    canSeeAllTasks: false,
    canSeeFETasks: false,
    canSeeBETasks: false,
    canSeeDesignTasks: false,
    canSeeTestTasks: false,
    canSeeDevOpsTasks: false,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    
    // Team Management - None
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    
    // Project Management - None
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    
    // Documentation - Limited
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    
    // Meetings - None
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    
    // Analytics - Full Access
    canViewAllMetrics: true,
    canGenerateReports: true,
    canExportData: true,
    
    // Comments - Limited
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    
    // Special Permissions - None
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  
  'product-manager': {
    // Task Management - Limited
    canCreateTasks: true, // Can create product tasks
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    
    // Task Visibility - All Tasks
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    
    // Team Management - None
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    
    // Project Management - Limited
    canViewProjectOverview: true,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    
    // Documentation - Limited
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    
    // Meetings - None
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    
    // Analytics - None
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    
    // Comments - Limited
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    
    // Special Permissions - None
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  
  'scrum-master': {
    // Task Management - Limited
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    
    // Task Visibility - All Tasks
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    
    // Team Management - None
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    
    // Project Management - Sprint Management
    canViewProjectOverview: true,
    canEditProjectSettings: false,
    canCreateSprints: true,
    canManageSprints: true,
    
    // Documentation - Limited
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    
    // Meetings - Full Access
    canCreateMeetings: true,
    canEditMeetings: true,
    canDeleteMeetings: true,
    canViewAllMeetings: true,
    
    // Analytics - Limited
    canViewAllMetrics: true,
    canGenerateReports: false,
    canExportData: false,
    
    // Comments - Limited
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    
    // Special Permissions - None
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  
  'technical-lead': {
    // Task Management - Limited
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: true,
    
    // Task Visibility - All Tasks
    canSeeAllTasks: true,
    canSeeFETasks: true,
    canSeeBETasks: true,
    canSeeDesignTasks: true,
    canSeeTestTasks: true,
    canSeeDevOpsTasks: true,
    canSeeDataTasks: true,
    canSeeProductTasks: true,
    
    // Team Management - None
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    
    // Project Management - None
    canViewProjectOverview: true,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    
    // Documentation - Limited
    canUploadDocuments: true,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    
    // Meetings - None
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    
    // Analytics - None
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    
    // Comments - Limited
    canAddComments: true,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    
    // Special Permissions - None
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
  
  'other': {
    // Task Management - None
    canCreateTasks: false,
    canAssignTasks: false,
    canEditTasks: false,
    canDeleteTasks: false,
    canChangeDeadlines: false,
    canChangePriority: false,
    canChangeStatus: false,
    
    // Task Visibility - None
    canSeeAllTasks: false,
    canSeeFETasks: false,
    canSeeBETasks: false,
    canSeeDesignTasks: false,
    canSeeTestTasks: false,
    canSeeDevOpsTasks: false,
    canSeeDataTasks: false,
    canSeeProductTasks: false,
    
    // Team Management - None
    canAddTeamMembers: false,
    canRemoveTeamMembers: false,
    canChangeUserRoles: false,
    canViewAllTeamMembers: false,
    
    // Project Management - None
    canViewProjectOverview: false,
    canEditProjectSettings: false,
    canCreateSprints: false,
    canManageSprints: false,
    
    // Documentation - None
    canUploadDocuments: false,
    canDeleteDocuments: false,
    canViewAllDocuments: false,
    
    // Meetings - None
    canCreateMeetings: false,
    canEditMeetings: false,
    canDeleteMeetings: false,
    canViewAllMeetings: false,
    
    // Analytics - None
    canViewAllMetrics: false,
    canGenerateReports: false,
    canExportData: false,
    
    // Comments - None
    canAddComments: false,
    canEditComments: false,
    canDeleteComments: false,
    canViewAllComments: false,
    
    // Special Permissions - None
    canManagePermissions: false,
    canAccessAdminPanel: false,
    canViewUserActivity: false,
  },
};

// Helper function to get permissions for a role
export const getPermissionsForRole = (role: UserRole): Permissions => {
  return ROLE_PERMISSIONS[role];
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

