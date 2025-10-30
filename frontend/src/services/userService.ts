export interface CreateUserPayload {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  role?: string | null;
  avatar_url?: string | null;
}

export interface ApiError {
  detail?: string;
}

const BASE_URL = 'http://localhost:8000/api';

export async function createUser(payload: CreateUserPayload): Promise<Response> {
  return fetch(`${BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });
}


