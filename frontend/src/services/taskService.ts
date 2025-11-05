import { BASE_URL, handleJson } from './base';

// Task Types
export type TaskAssigneeDto = {
  id: number;
  user_id: number;
  user_name: string | null;
  user_email: string | null;
  assigned_at: string;
};

export type TaskDto = {
  id: number;
  title: string;
  description: string | null;
  project_id: number | null;
  project_name: string | null;
  sprint_id: number | null;
  sprint_name: string | null;
  status_key: string | null;
  status_name: string | null;
  priority_key: string | null;
  priority_name: string | null;
  task_type_key: string | null;
  task_type_name: string | null;
  assignee_id: number | null;
  reviewer_id: number | null;
  reviewer_name: string | null;
  assignees: TaskAssigneeDto[];
  links_count: number;
  comments_count: number;
  due_date: string | null;
  estimated_hours: number | null;
  actual_hours: number | null;
  progress_percentage: number;
  created_by: number | null;
  creator_name: string | null;
  created_at: string;
  updated_at: string;
};

export type TaskCreatePayload = {
  title: string;
  description?: string | null;
  project_id?: number | null;
  sprint_id?: number | null;
  status_key?: string | null;
  priority_key?: string | null;
  task_type_key?: string | null;
  assignee_ids?: number[];
  reviewer_id?: number | null;
  due_date?: string | null;
  estimated_hours?: number | null;
  progress_percentage?: number;
  created_by?: number | null;
};

export type TaskUpdatePayload = {
  title?: string;
  description?: string | null;
  project_id?: number | null;
  sprint_id?: number | null;
  status_key?: string | null;
  priority_key?: string | null;
  task_type_key?: string | null;
  assignee_ids?: number[] | null;
  reviewer_id?: number | null;
  due_date?: string | null;
  estimated_hours?: number | null;
  actual_hours?: number | null;
  progress_percentage?: number;
};

// Task lookup options
export type TaskStatusOption = {
  key: string;
  name: string;
};

export type TaskPriorityOption = {
  key: string;
  name: string;
};

export type TaskTypeOption = {
  key: string;
  name: string;
};

// Tasks API
export async function getTasks(params?: {
  project_id?: number;
  sprint_id?: number;
  status_key?: string;
  priority_key?: string;
  task_type_key?: string;
  assignee_id?: number;
  skip?: number;
  limit?: number;
}): Promise<TaskDto[]> {
  const queryParams = new URLSearchParams();
  if (params?.project_id !== undefined) queryParams.append('project_id', params.project_id.toString());
  if (params?.sprint_id !== undefined) queryParams.append('sprint_id', params.sprint_id.toString());
  if (params?.status_key) queryParams.append('status_key', params.status_key);
  if (params?.priority_key) queryParams.append('priority_key', params.priority_key);
  if (params?.task_type_key) queryParams.append('task_type_key', params.task_type_key);
  if (params?.assignee_id !== undefined) queryParams.append('assignee_id', params.assignee_id.toString());
  if (params?.skip !== undefined) queryParams.append('skip', params.skip.toString());
  if (params?.limit !== undefined) queryParams.append('limit', params.limit.toString());
  
  const url = `${BASE_URL}/api/tasks${queryParams.toString() ? '?' + queryParams.toString() : ''}`;
  const res = await fetch(url);
  return handleJson<TaskDto[]>(res);
}

export async function getTask(taskId: number): Promise<TaskDto> {
  const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`);
  return handleJson<TaskDto>(res);
}

export async function createTask(payload: TaskCreatePayload): Promise<TaskDto> {
  const res = await fetch(`${BASE_URL}/api/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleJson<TaskDto>(res);
}

export async function updateTask(taskId: number, payload: TaskUpdatePayload): Promise<TaskDto> {
  const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
  return handleJson<TaskDto>(res);
}

export async function deleteTask(taskId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/tasks/${taskId}`, {
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

// Task lookup options API
export async function getTaskStatuses(): Promise<TaskStatusOption[]> {
  const res = await fetch(`${BASE_URL}/api/tasks/statuses`);
  return handleJson<TaskStatusOption[]>(res);
}

export async function getTaskPriorities(): Promise<TaskPriorityOption[]> {
  const res = await fetch(`${BASE_URL}/api/tasks/priorities`);
  return handleJson<TaskPriorityOption[]>(res);
}

export async function getTaskTypes(): Promise<TaskTypeOption[]> {
  const res = await fetch(`${BASE_URL}/api/tasks/types`);
  return handleJson<TaskTypeOption[]>(res);
}

