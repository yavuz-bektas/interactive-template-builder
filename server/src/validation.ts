import { randomUUID } from 'node:crypto';
import type {
  Alignment,
  ButtonElement,
  DividerElement,
  HeadingElement,
  ImageElement,
  Position,
  Size,
  TemplateElement,
  TemplateInput,
  TextElement
} from './types';

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function isNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value);
}

function isString(value: unknown): value is string {
  return typeof value === 'string';
}

function parsePosition(value: unknown): Position | null {
  if (!isRecord(value) || !isNumber(value.x) || !isNumber(value.y)) {
    return null;
  }
  return { x: value.x, y: value.y };
}

function parseSize(value: unknown): Size | null {
  if (!isRecord(value) || !isNumber(value.width) || !isNumber(value.height)) {
    return null;
  }
  return { width: value.width, height: value.height };
}

function parseAlignment(value: unknown): Alignment | null {
  return value === 'left' || value === 'center' || value === 'right' ? value : null;
}

function parseElement(value: unknown): TemplateElement | null {
  if (!isRecord(value)) {
    return null;
  }

  const position = parsePosition(value.position);
  const size = parseSize(value.size);
  if (!position || !size) {
    return null;
  }

  const id = isString(value.id) && value.id ? value.id : randomUUID();
  const type = value.type;
  if (!isString(type)) {
    return null;
  }

  if (type === 'heading' || type === 'text') {
    const alignment = parseAlignment(value.alignment);
    if (!isString(value.content) || !isNumber(value.fontSize) || !isString(value.color) || !alignment) {
      return null;
    }
    if (type === 'heading') {
      const heading: HeadingElement = {
        id,
        type,
        position,
        size,
        content: value.content,
        fontSize: value.fontSize,
        color: value.color,
        alignment
      };
      return heading;
    }
    const text: TextElement = {
      id,
      type,
      position,
      size,
      content: value.content,
      fontSize: value.fontSize,
      color: value.color,
      alignment
    };
    return text;
  }

  if (type === 'button') {
    if (
      !isString(value.text) ||
      !isString(value.backgroundColor) ||
      !isString(value.textColor) ||
      !isNumber(value.borderRadius)
    ) {
      return null;
    }
    const button: ButtonElement = {
      id,
      type,
      position,
      size,
      text: value.text,
      backgroundColor: value.backgroundColor,
      textColor: value.textColor,
      borderRadius: value.borderRadius
    };
    return button;
  }

  if (type === 'image') {
    if (!isString(value.url) || !isString(value.altText)) {
      return null;
    }
    const image: ImageElement = {
      id,
      type,
      position,
      size,
      url: value.url,
      altText: value.altText
    };
    return image;
  }

  if (type === 'divider') {
    if (!isString(value.color)) {
      return null;
    }
    const divider: DividerElement = {
      id,
      type,
      position,
      size,
      color: value.color
    };
    return divider;
  }

  return null;
}

export function parseTemplateInput(value: unknown): TemplateInput | null {
  if (!isRecord(value)) {
    return null;
  }

  const name = isString(value.name) && value.name.trim() ? value.name.trim() : 'Untitled Template';
  const canvasSize = parseSize(value.canvasSize);
  const backgroundColor = isString(value.backgroundColor) ? value.backgroundColor : '#ffffff';

  if (!canvasSize || canvasSize.width <= 0 || canvasSize.height <= 0) {
    return null;
  }

  if (!Array.isArray(value.elements)) {
    return null;
  }
  const elements: TemplateElement[] = [];
  for (const element of value.elements) {
    const parsed = parseElement(element);
    if (!parsed) {
      return null;
    }
    elements.push(parsed);
  }

  return {
    id: isString(value.id) ? value.id : undefined,
    name,
    elements,
    canvasSize,
    backgroundColor,
    createdAt: isString(value.createdAt) ? value.createdAt : undefined
  };
}
