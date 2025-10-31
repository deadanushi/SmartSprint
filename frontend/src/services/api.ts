const BASE_URL = 'http://localhost:8000';

// Types
export type RoleDto = {
  id: number;
  role_key: string;
  name: string;
  created_at?: string;
};

export type CompanyDto = {
  id: number;
  name: string;
  domain: string | null;
  logo_url: string | null;
  is_active: boolean;
};

export type PermissionDto = {
  id: number;
  perm_key: string;
  name: string;
  category: string;
  created_at?: string;
};

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

export type RolePermissionsDto = {
  role_id: number;
  role_key: string;
  role_name: string;
  permissions: PermissionDto[];
};

export type RegisterPayload = {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role: string; // role_key
  avatar_url: string | null;
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

export type RolePermissionsUpdatePayload = {
  permission_ids: number[];
};

export type UserPermissionUpdatePayload = {
  permission_key: string;
  granted: boolean;
};

// Helper function
async function handleJson<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let detail = '';
    try {
      const data = await res.json();
      detail = data?.detail || '';
    } catch {}
    throw new Error(detail || `Request failed (${res.status})`);
  }
  return res.json();
}

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

// Users API
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

// Companies API
export async function searchCompanies(query: string): Promise<CompanyDto[]> {
  const url = `${BASE_URL}/api/companies/search?q=${encodeURIComponent(query)}`;
  const res = await fetch(url);
  return handleJson<CompanyDto[]>(res);
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


