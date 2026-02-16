import type {
  ButtonElement,
  DividerElement,
  ElementType,
  HeadingElement,
  ImageElement,
  Position,
  Template,
  TemplateElement,
  TextElement
} from '@/types/template';

export const DEFAULT_CANVAS_WIDTH = 400;
export const DEFAULT_CANVAS_HEIGHT = 500;

function createId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

export function cloneTemplate(template: Template): Template {
  return JSON.parse(JSON.stringify(template)) as Template;
}

export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

export function clampPosition(
  position: Position,
  elementWidth: number,
  elementHeight: number,
  canvasWidth: number,
  canvasHeight: number
): Position {
  return {
    x: clamp(position.x, 0, Math.max(0, canvasWidth - elementWidth)),
    y: clamp(position.y, 0, Math.max(0, canvasHeight - elementHeight))
  };
}

export function createTemplate(name = 'Untitled Template'): Template {
  const timestamp = new Date().toISOString();
  return {
    id: createId(),
    name,
    elements: [],
    canvasSize: {
      width: DEFAULT_CANVAS_WIDTH,
      height: DEFAULT_CANVAS_HEIGHT
    },
    backgroundColor: '#ffffff',
    createdAt: timestamp,
    updatedAt: timestamp
  };
}

export function createElement(type: ElementType, position: Position): TemplateElement {
  const id = createId();

  switch (type) {
    case 'heading':
      return {
        id,
        type,
        position,
        size: { width: 260, height: 52 },
        content: 'Heading text',
        fontSize: 28,
        color: '#111827',
        alignment: 'left'
      } satisfies HeadingElement;
    case 'text':
      return {
        id,
        type,
        position,
        size: { width: 280, height: 80 },
        content: 'Supporting text goes here.',
        fontSize: 16,
        color: '#374151',
        alignment: 'left'
      } satisfies TextElement;
    case 'button':
      return {
        id,
        type,
        position,
        size: { width: 160, height: 44 },
        text: 'Click me',
        backgroundColor: '#2563eb',
        textColor: '#ffffff',
        borderRadius: 8
      } satisfies ButtonElement;
    case 'image':
      return {
        id,
        type,
        position,
        size: { width: 220, height: 140 },
        url: '',
        altText: 'Image placeholder'
      } satisfies ImageElement;
    case 'divider':
      return {
        id,
        type,
        position,
        size: { width: 260, height: 2 },
        color: '#d1d5db'
      } satisfies DividerElement;
    default:
      throw new Error(`Unsupported element type: ${String(type)}`);
  }
}
