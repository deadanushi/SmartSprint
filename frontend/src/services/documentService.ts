import { BASE_URL, handleJson } from './base';

// Document Types
export type DocumentDto = {
  id: number;
  title: string;
  description: string | null;
  file_name: string;
  file_path: string;
  file_size: number;
  mime_type: string | null;
  project_id: number | null;
  uploaded_by: number | null;
  uploaded_by_name: string | null;
  is_processed: boolean;
  extracted_text: string | null;
  text_extracted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type DocumentUploadPayload = {
  title?: string;
  description?: string;
};

// Documents API
export async function getDocuments(projectId: number): Promise<DocumentDto[]> {
  const res = await fetch(`${BASE_URL}/api/projects/${projectId}/documents`);
  return handleJson<DocumentDto[]>(res);
}

export async function getDocument(documentId: number): Promise<DocumentDto> {
  const res = await fetch(`${BASE_URL}/api/documents/${documentId}`);
  return handleJson<DocumentDto>(res);
}

export async function uploadDocument(
  projectId: number,
  file: File,
  payload?: DocumentUploadPayload
): Promise<DocumentDto> {
  const formData = new FormData();
  formData.append('file', file);
  if (payload?.title) formData.append('title', payload.title);
  if (payload?.description) formData.append('description', payload.description);
  formData.append('project_id', projectId.toString());

  const res = await fetch(`${BASE_URL}/api/projects/${projectId}/documents/upload`, {
    method: 'POST',
    body: formData,
  });
  return handleJson<DocumentDto>(res);
}

export async function deleteDocument(documentId: number): Promise<void> {
  const res = await fetch(`${BASE_URL}/api/documents/${documentId}`, {
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

// Helper function to format file size
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Helper function to validate file type
export function isValidDocumentType(file: File): boolean {
  const validTypes = [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-word',
  ];
  const validExtensions = ['.pdf', '.doc', '.docx'];
  
  if (validTypes.includes(file.type)) return true;
  
  const fileName = file.name.toLowerCase();
  return validExtensions.some(ext => fileName.endsWith(ext));
}

