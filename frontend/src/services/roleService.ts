import { BASE_URL, handleJson } from './base';

// Role Types
export type RoleDto = {
  id: number;
  role_key: string;
  name: string;
  created_at?: string;
};

export type PermissionDto = {
  id: number;
  perm_key: string;
  name: string;
  category: string;
  created_at?: string;
};

export type RolePermissionsDto = {
  role_id: number;
  role_key: string;
  role_name: string;
  permissions: PermissionDto[];
};

export type RolePermissionsUpdatePayload = {
  permission_ids: number[];
};

// Roles API
export async function getRoles(): Promise<RoleDto[]> {
  const res = await fetch(`${BASE_URL}/api/roles`);
  return handleJson<RoleDto[]>(res);
}

export async function getRole(roleId: number): Promise<RoleDto> {
  const res = await fetch(`${BASE_URL}/api/roles/${roleId}`);
  return handleJson<RoleDto>(res);
}

export async function updateRole(roleId: number, payload: { name?: string }): Promise<RoleDto> {
  const res = await fetch(`${BASE_URL}/api/roles/${roleId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleJson<RoleDto>(res);
}

// Permissions API
export async function getPermissions(category?: string): Promise<PermissionDto[]> {
  const url = category 
    ? `${BASE_URL}/api/permissions?category=${encodeURIComponent(category)}`
    : `${BASE_URL}/api/permissions`;
  const res = await fetch(url);
  return handleJson<PermissionDto[]>(res);
}

export async function getPermission(permissionId: number): Promise<PermissionDto> {
  const res = await fetch(`${BASE_URL}/api/permissions/${permissionId}`);
  return handleJson<PermissionDto>(res);
}

// Role Permissions API
export async function getRolePermissions(roleId: number): Promise<RolePermissionsDto> {
  const res = await fetch(`${BASE_URL}/api/roles/${roleId}/permissions`);
  return handleJson<RolePermissionsDto>(res);
}

export async function updateRolePermissions(
  roleId: number,
  payload: RolePermissionsUpdatePayload
): Promise<RolePermissionsDto> {
  const res = await fetch(`${BASE_URL}/api/roles/${roleId}/permissions`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleJson<RolePermissionsDto>(res);
}

