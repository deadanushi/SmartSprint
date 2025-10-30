import { jwtDecode } from 'jwt-decode';
import { User, UserRole } from '../types/permissions';

// Simple token interface for demo purposes
interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  company: string;
  exp: number;
  iat: number;
}

// Static users for testing
export const staticUsers: User[] = [
  {
    id: 'user-1',
    firstName: 'Davis',
    lastName: 'Donin',
    email: 'pm@example.com',
    role: 'project-manager',
    company: 'Google',
    permissions: {
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
      canViewProjectOverview: true,
      canEditProjectSettings: true,
      canCreateSprints: true,
      canManageSprints: true,
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
    avatar: 'DD',
    isActive: true,
    createdAt: '2024-01-01',
    lastLogin: '2024-01-15',
  },
  {
    id: 'user-2',
    firstName: 'John',
    lastName: 'Developer',
    email: 'dev@example.com',
    role: 'frontend-developer',
    company: 'Google',
    permissions: {
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
      canViewProjectOverview: false,
      canEditProjectSettings: false,
      canCreateSprints: false,
      canManageSprints: false,
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
    avatar: 'JD',
    isActive: true,
    createdAt: '2024-01-02',
    lastLogin: '2024-01-14',
  },
];

// Simple password hash function (in production, use bcrypt)
const simpleHash = (password: string): string => {
  return btoa(password); // Base64 encoding for demo purposes
};

// Verify password
const verifyPassword = (password: string, hash: string): boolean => {
  return btoa(password) === hash;
};

// Generate a simple token for demo purposes (in production, this should be done on the server)
export const generateToken = (user: User): string => {
  const payload = {
    userId: user.id,
    email: user.email,
    role: user.role,
    company: user.company,
    exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours from now
    iat: Math.floor(Date.now() / 1000), // issued at
  };
  
  // For demo purposes, we'll create a simple base64 encoded token
  // In production, this should be done on the server with proper JWT signing
  return btoa(JSON.stringify(payload));
};

// Verify token (for demo purposes)
export const verifyToken = (token: string): TokenPayload | null => {
  try {
    const decoded = JSON.parse(atob(token)) as TokenPayload;
    
    // Check if token is expired
    if (decoded.exp && decoded.exp < Math.floor(Date.now() / 1000)) {
      return null;
    }
    
    return decoded;
  } catch (error) {
    return null;
  }
};

// Login function
export const login = (email: string, password: string): { success: boolean; user?: User; token?: string; error?: string } => {
  // Find user by email
  const user = staticUsers.find(u => u.email === email && u.isActive);
  
  if (!user) {
    return { success: false, error: 'User not found' };
  }
  
  // For demo purposes, use simple passwords
  const validPasswords: { [key: string]: string } = {
    'pm@example.com': 'password123',
    'dev@example.com': 'password123',
  };
  
  if (validPasswords[email] !== password) {
    return { success: false, error: 'Invalid password' };
  }
  
  // Generate token
  const token = generateToken(user);
  
  // Update last login
  user.lastLogin = new Date().toISOString();
  
  return { success: true, user, token };
};

// Get user by ID
export const getUserById = (userId: string): User | null => {
  return staticUsers.find(u => u.id === userId) || null;
};

// Get user from token
export const getUserFromToken = (token: string): User | null => {
  const decoded = verifyToken(token);
  if (!decoded) return null;
  
  return getUserById(decoded.userId);
};

// Check if user has permission
export const hasPermission = (user: User, permission: keyof User['permissions']): boolean => {
  return user.permissions[permission];
};

// Check if user can access route
export const canAccessRoute = (user: User, route: string): boolean => {
  // Define route permissions
  const routePermissions: { [key: string]: (keyof User['permissions'])[] } = {
    '/tasks': ['canSeeAllTasks', 'canSeeFETasks', 'canSeeBETasks', 'canSeeDesignTasks', 'canSeeTestTasks', 'canSeeDevOpsTasks', 'canSeeDataTasks', 'canSeeProductTasks'],
    '/backlog': ['canViewProjectOverview'],
    '/permissions': ['canManagePermissions'],
    '/calendar': ['canViewAllMeetings', 'canCreateMeetings'],
    '/docs': ['canViewAllDocuments', 'canUploadDocuments'],
  };
  
  const requiredPermissions = routePermissions[route];
  if (!requiredPermissions) return true; // No specific permissions required
  
  return requiredPermissions.some((permission: keyof User['permissions']) => hasPermission(user, permission));
};

// Token storage utilities
export const tokenStorage = {
  set: (token: string) => {
    localStorage.setItem('authToken', token);
  },
  
  get: (): string | null => {
    return localStorage.getItem('authToken');
  },
  
  remove: () => {
    localStorage.removeItem('authToken');
  },
  
  isValid: (): boolean => {
    const token = tokenStorage.get();
    if (!token) return false;
    
    const decoded = verifyToken(token);
    return decoded !== null;
  },
  
  getDecoded: () => {
    const token = tokenStorage.get();
    if (!token) return null;
    
    return verifyToken(token);
  }
};
