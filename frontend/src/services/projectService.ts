import { BASE_URL, handleJson } from './base';

// Project Types
export type ProjectDto = {
  id: number;
  name: string;
  description: string | null;
  company_id: number | null;
  company_name: string | null;
  project_manager_id: number | null;
  project_manager_name: string | null;
  status_key: string | null;
  status_name: string | null;
  start_date: string | null;
  end_date: string | null;
  budget: number | null;
  tasks_count: number;
  sprints_count: number;
  members_count: number;
  created_at: string;
  updated_at: string;
};

export type ProjectCreatePayload = {
  name: string;
  description?: string | null;
  company_id?: number | null;
  project_manager_id?: number | null;
  status_key?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
};

export type ProjectUpdatePayload = {
  name?: string;
  description?: string | null;
  company_id?: number | null;
  project_manager_id?: number | null;
  status_key?: string | null;
  start_date?: string | null;
  end_date?: string | null;
  budget?: number | null;
};

// Projects API
export async function getProjects(params?: {
  company_id?: number;
  project_manager_id?: number;
  status_key?: string;
  skip?: number;
  limit?: number;
}): Promise<ProjectDto[]> {
  const queryParams = new URLSearchParams();
  if (params?.company_id !== undefined) queryParams.append('company_id', params.company_id.toString());
  if (params?.project_manager_id !== undefined) queryParams.append('project_manager_id', params.project_manager_id.toString());
  if (params?.status_key) queryParams.append('status_key', params.status_key);
  if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
  
  const url = `${BASE_URL}/api/projects${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  const res = await fetch(url);
  return handleJson<ProjectDto[]>(res);
}

export async function getProject(projectId: number): Promise<ProjectDto> {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}`);
  return handleJson<ProjectDto>(res);
}

export async function createProject(payload: ProjectCreatePayload): Promise<ProjectDto> {
  const res = await fetch(`${BASE_URL}/api/projects`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleJson<ProjectDto>(res);
}

export async function updateProject(projectId: number, payload: ProjectUpdatePayload): Promise<ProjectDto> {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleJson<ProjectDto>(res);
}

export async function deleteProject(projectId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    let detail = '';
    try {
      const data = await res.json();
      detail = data?.detail || '';
    } catch {}
    throw new Error(detail || `Request failed (${res.status})`);
  }
}

