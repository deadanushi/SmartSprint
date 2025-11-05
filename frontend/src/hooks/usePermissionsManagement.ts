import { useState, useCallback } from 'react';
import {
  getRoles,
  getRolePermissions,
  updateRolePermissions,
  getPermissions,
} from '../services/roleService';
import type {
  RoleDto,
  PermissionDto,
  RolePermissionsDto,
} from '../services/roleService';

interface UsePermissionsManagementReturn {
  roles: RoleDto[];
  allPermissions: PermissionDto[];
  selectedRole: RoleDto | null;
  rolePermissions: RolePermissionsDto | null;
  selectedPermissionIds: Set<number>;
  isLoading: boolean;
  isSaving: boolean;
  error: string | null;
  setSelectedRole: (role: RoleDto | null) => void;
  setSelectedPermissionIds: (ids: Set<number>) => void;
  loadRolePermissions: (role: RoleDto) => Promise<void>;
  saveRolePermissions: () => Promise<void>;
  refetchRoles: () => Promise<void>;
  refetchPermissions: () => Promise<void>;
  clearError: () => void;
}

/**
 * Custom hook for PermissionsManagementPage that aggregates role and permission data
 * Reduces coupling by encapsulating multiple service calls
 */
export const usePermissionsManagement = (): UsePermissionsManagementReturn => {
  const [roles, setRoles] = useState<RoleDto[]>([]);
  const [allPermissions, setAllPermissions] = useState<PermissionDto[]>([]);
  const [selectedRole, setSelectedRole] = useState<RoleDto | null>(null);
  const [rolePermissions, setRolePermissions] = useState<RolePermissionsDto | null>(null);
  const [selectedPermissionIds, setSelectedPermissionIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refetchRoles = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const rolesData = await getRoles();
      setRoles(rolesData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load roles';
      setError(errorMessage);
      console.error('Error fetching roles:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const refetchPermissions = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const permissionsData = await getPermissions();
      setAllPermissions(permissionsData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load permissions';
      setError(errorMessage);
      console.error('Error fetching permissions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loadRolePermissions = useCallback(async (role: RoleDto) => {
    try {
      setIsLoading(true);
      setError(null);
      const permissionsData = await getRolePermissions(role.id);
      setRolePermissions(permissionsData);
      setSelectedRole(role);
      
      // Initialize selected permission IDs from role permissions
      // RolePermissionsDto has a permissions array
      const grantedPermissionIds = new Set(permissionsData.permissions.map(p => p.id));
      setSelectedPermissionIds(grantedPermissionIds);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load role permissions';
      setError(errorMessage);
      console.error('Error fetching role permissions:', err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveRolePermissions = useCallback(async () => {
    if (!selectedRole) return;

    try {
      setIsSaving(true);
      setError(null);

      // Build update payload with permission IDs
      const permissionIds = Array.from(selectedPermissionIds);
      
      await updateRolePermissions(selectedRole.id, {
        permission_ids: permissionIds,
      });

      // Reload role permissions to get updated state
      await loadRolePermissions(selectedRole);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save permissions';
      setError(errorMessage);
      console.error('Error saving role permissions:', err);
      throw err;
    } finally {
      setIsSaving(false);
    }
  }, [selectedRole, selectedPermissionIds, loadRolePermissions]);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    roles,
    allPermissions,
    selectedRole,
    rolePermissions,
    selectedPermissionIds,
    isLoading,
    isSaving,
    error,
    setSelectedRole,
    setSelectedPermissionIds,
    loadRolePermissions,
    saveRolePermissions,
    refetchRoles,
    refetchPermissions,
    clearError,
  };
};

