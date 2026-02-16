import type { Template } from '@/types/template';

const API_BASE = '';

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: {
      'Content-Type': 'application/json',
      ...(init?.headers ?? {})
    },
    ...init
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || `API request failed with status ${response.status}`);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

export function listTemplates(): Promise<Template[]> {
  return request<Template[]>('/api/templates');
}

export function saveTemplate(template: Template): Promise<Template> {
  return request<Template>('/api/templates', {
    method: 'POST',
    body: JSON.stringify(template)
  });
}

export function deleteTemplate(id: string): Promise<void> {
  return request<void>(`/api/templates/${id}`, {
    method: 'DELETE'
  });
}
