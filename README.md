# Interactive Template Builder

A full-stack implementation of the **Trial Day Project: Interactive Template Builder** using Vue 3 + TypeScript (strict) on the frontend and Express on the backend.

## Tech Stack

- Frontend: Vue 3 (Composition API), TypeScript strict, Vite, Pinia
- Backend: Node.js + Express
- Persistence: JSON file (`server/data/templates.json`) + in-memory runtime cache
- Testing: Jest + Vue Test Utils

## Project Structure

- `client/` Vue app (builder UI, state management, tests)
- `server/` Express API (template CRUD + JSON persistence)
- `server/data/templates.json` local template storage

## API

- `GET /api/templates` list templates
- `POST /api/templates` create/update template by `id`
- `DELETE /api/templates/:id` delete template

## Run

1. Install dependencies from repo root:

```bash
npm install
```

2. Start backend (Terminal 1):

```bash
npm run server
```

3. Start frontend (Terminal 2):

```bash
npm run dev
```

Frontend runs on Vite default URL (usually `http://localhost:5173`).
Backend runs on `http://localhost:3001`.

## Test

From repo root:

```bash
npm run test
```

This runs the client Jest test suite.

Optional:

```bash
npm run test:all
```

## Implemented Features

- 3-column builder layout (Elements / Canvas / Properties)
- Drag from left palette to canvas (Heading, Text, Button, Image, Divider)
- Fixed-size canvas (`400x500`) with persisted background color
- Select elements, move by drag, resize via corner handles
- Bounding constraints for move/resize inside canvas
- Delete selected element by `Delete`/`Backspace` key or panel button
- Live properties editing panel by element type
- Undo/Redo via buttons and keyboard (`Ctrl/Cmd+Z`, `Ctrl/Cmd+Y`, `Cmd+Shift+Z`)
- Layer controls (`Bring Forward`, `Send Backward`)
- Template management: new, save, load, list, delete (through backend API)
- Export current template to downloadable JSON file
- Arrow key nudge support (`1px`, `Shift` = `5px`)

## Tests Included

1. `client/tests/templateStore.test.ts`
- Verifies store history behavior for add element -> undo -> redo

2. `client/tests/canvasElement.test.ts`
- Verifies button element renders correct text and styles
