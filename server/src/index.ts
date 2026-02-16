import cors from 'cors';
import express from 'express';
import {
  deleteTemplateById,
  initializeRepository,
  listTemplates,
  upsertTemplate
} from './templateRepository';
import { parseTemplateInput } from './validation';

const app = express();
const port = Number(process.env.PORT ?? 3001);

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/api/templates', (_request, response) => {
  response.json(listTemplates());
});

app.post('/api/templates', async (request, response) => {
  const parsedInput = parseTemplateInput(request.body);
  if (!parsedInput) {
    response.status(400).json({ message: 'Invalid template payload.' });
    return;
  }

  try {
    const savedTemplate = await upsertTemplate(parsedInput);
    response.json(savedTemplate);
  } catch {
    response.status(500).json({ message: 'Failed to save template.' });
  }
});

app.delete('/api/templates/:id', async (request, response) => {
  try {
    const wasDeleted = await deleteTemplateById(request.params.id);
    if (!wasDeleted) {
      response.status(404).json({ message: 'Template not found.' });
      return;
    }
    response.status(204).send();
  } catch {
    response.status(500).json({ message: 'Failed to delete template.' });
  }
});

app.get('/health', (_request, response) => {
  response.json({ status: 'ok' });
});

export async function startServer(): Promise<void> {
  await initializeRepository();
  app.listen(port, () => {
    console.log(`Template API running on http://localhost:${port}`);
  });
}

if (process.env.NODE_ENV !== 'test') {
  void startServer();
}

export default app;
