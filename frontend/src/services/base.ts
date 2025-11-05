const BASE_URL = 'http://localhost:8000';

export { BASE_URL };

export async function handleJson<T>(res: Response): Promise<T> {
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

