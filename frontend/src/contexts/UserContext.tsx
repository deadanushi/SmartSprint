import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { User, UserRole, getPermissionsForRole } from '../types/permissions';
import { tokenStorage, getUserFromToken, login as authLogin } from '../utils/auth';

interface UserContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  hasPermission: (permission: keyof User['permissions']) => boolean;
  canSeeTaskType: (taskType: string) => boolean;
  isProjectManager: () => boolean;
  logout: () => void;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  isLoading: boolean;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing token on mount
  useEffect(() => {
    const initializeAuth = () => {
      const token = tokenStorage.get();
      if (token && tokenStorage.isValid()) {
        const user = getUserFromToken(token);
        if (user) {
          // Ensure permissions are set
          if (!user.permissions) {
            user.permissions = getPermissionsForRole(user.role);
          }
          setCurrentUser(user);
        } else {
          tokenStorage.remove();
        }
      }
      setIsLoading(false);
    };

    initializeAuth();
  }, []);

  const hasPermission = (permission: keyof User['permissions']): boolean => {
    if (!currentUser || !currentUser.permissions) return false;
    return currentUser.permissions[permission] === true;
  };

  const canSeeTaskType = (taskType: string): boolean => {
    if (!currentUser || !currentUser.permissions) return false;
    
    switch (taskType.toLowerCase()) {
      case 'frontend':
      case 'ui':
      case 'ux':
        return currentUser.permissions.canSeeFETasks === true || currentUser.permissions.canSeeAllTasks === true;
      case 'backend':
      case 'api':
      case 'database':
        return currentUser.permissions.canSeeBETasks === true || currentUser.permissions.canSeeAllTasks === true;
      case 'design':
        return currentUser.permissions.canSeeDesignTasks === true || currentUser.permissions.canSeeAllTasks === true;
      case 'test':
      case 'qa':
        return currentUser.permissions.canSeeTestTasks === true || currentUser.permissions.canSeeAllTasks === true;
      case 'devops':
      case 'deployment':
        return currentUser.permissions.canSeeDevOpsTasks === true || currentUser.permissions.canSeeAllTasks === true;
      case 'data':
      case 'analytics':
        return currentUser.permissions.canSeeDataTasks === true || currentUser.permissions.canSeeAllTasks === true;
      case 'product':
        return currentUser.permissions.canSeeProductTasks === true || currentUser.permissions.canSeeAllTasks === true;
      default:
        return currentUser.permissions.canSeeAllTasks === true;
    }
  };

  const isProjectManager = (): boolean => {
    return currentUser?.role === 'project-manager';
  };

  const logout = (): void => {
    // Clear user data
    setCurrentUser(null);
    
    // Clear stored token
    tokenStorage.remove();
    
    console.log('User logged out successfully');
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    // Try backend first
    try {
      const url = new URL('http://localhost:8000/api/users/login');
      url.searchParams.set('email', email);
      url.searchParams.set('password', password);

      const res = await fetch(url.toString(), { method: 'GET' });
      if (res.ok) {
        const u = await res.json();
        // Map backend user to frontend User shape
        // Handle role_key from backend (from roles table) or role field
        const roleKey = u.role_key || u.role || 'other';
        const role = (roleKey === 'admin' ? 'admin' : roleKey) as UserRole;
        const mapped: User = {
          id: String(u.id),
          firstName: u.first_name || u.firstName || '',
          lastName: u.last_name || u.lastName || '',
          email: u.email,
          role,
          company: u.company_name || u.company || '',
          permissions: getPermissionsForRole(role),
          avatar: (u.first_name?.[0] || '?') + (u.last_name?.[0] || ''),
          isActive: u.is_active !== false,
          createdAt: u.created_at || new Date().toISOString(),
          lastLogin: u.last_login || new Date().toISOString(),
        };
        // Create a simple token for existing client logic
        const payload = {
          userId: mapped.id,
          email: mapped.email,
          role: mapped.role,
          company: mapped.company,
          exp: Math.floor(Date.now() / 1000) + 24 * 60 * 60,
          iat: Math.floor(Date.now() / 1000),
        };
        const token = btoa(JSON.stringify(payload));
        tokenStorage.set(token);
        setCurrentUser(mapped);
        return { success: true };
      }
    } catch (e) {
      // fall back to demo login below
    }

    // Fallback to existing demo login
    try {
      const result = authLogin(email, password);
      
      if (result.success && result.user && result.token) {
        tokenStorage.set(result.token);
        setCurrentUser(result.user);
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Login failed' };
      }
    } catch (error) {
      return { success: false, error: 'An error occurred during login' };
    }
  };

  return (
    <UserContext.Provider value={{
      currentUser,
      setCurrentUser,
      hasPermission,
      canSeeTaskType,
      isProjectManager,
      logout,
      login,
      isLoading,
    }}>
      {children}
    </UserContext.Provider>
  );
};
