import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import type { Template, TemplateInput } from './types';

const DATA_FILE = path.resolve(__dirname, '../data/templates.json');

let templates: Template[] = [];

async function persistTemplates(): Promise<void> {
  await fs.writeFile(DATA_FILE, JSON.stringify(templates, null, 2), 'utf8');
}

export async function initializeRepository(): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  try {
    await fs.access(DATA_FILE);
  } catch {
    await fs.writeFile(DATA_FILE, '[]', 'utf8');
  }

  try {
    const fileContent = await fs.readFile(DATA_FILE, 'utf8');
    const parsed = JSON.parse(fileContent) as Template[];
    templates = Array.isArray(parsed) ? parsed : [];
  } catch {
    templates = [];
    await persistTemplates();
  }
}

export function listTemplates(): Template[] {
  return [...templates].sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export async function upsertTemplate(input: TemplateInput): Promise<Template> {
  const now = new Date().toISOString();
  const existingIndex = input.id ? templates.findIndex((template) => template.id === input.id) : -1;

  if (existingIndex >= 0) {
    const existingTemplate = templates[existingIndex];
    const updatedTemplate: Template = {
      ...existingTemplate,
      ...input,
      id: existingTemplate.id,
      createdAt: existingTemplate.createdAt,
      updatedAt: now
    };
    templates[existingIndex] = updatedTemplate;
    await persistTemplates();
    return updatedTemplate;
  }

  const createdTemplate: Template = {
    ...input,
    id: input.id ?? randomUUID(),
    createdAt: input.createdAt ?? now,
    updatedAt: now
  };
  templates.push(createdTemplate);
  await persistTemplates();
  return createdTemplate;
}

export async function deleteTemplateById(id: string): Promise<boolean> {
  const previousLength = templates.length;
  templates = templates.filter((template) => template.id !== id);
  if (templates.length === previousLength) {
    return false;
  }
  await persistTemplates();
  return true;
}
