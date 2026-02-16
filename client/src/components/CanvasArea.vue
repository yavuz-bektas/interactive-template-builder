<script setup lang="ts">
import { computed, onBeforeUnmount, ref } from 'vue';
import CanvasElement from '@/components/CanvasElement.vue';
import { useTemplateStore } from '@/stores/templateStore';
import { clamp } from '@/utils/template';
import type { ElementType, Position, ResizeDirection, Size } from '@/types/template';

const DRAG_MIME = 'application/x-template-element';
const MIN_WIDTH = 40;
const MIN_HEIGHT = 24;

type DragInteraction = {
  mode: 'drag';
  id: string;
  startMouse: Position;
  startPosition: Position;
  size: Size;
};

type ResizeInteraction = {
  mode: 'resize';
  id: string;
  direction: ResizeDirection;
  startMouse: Position;
  startPosition: Position;
  startSize: Size;
};

type Interaction = DragInteraction | ResizeInteraction;

const store = useTemplateStore();
const canvasRef = ref<HTMLDivElement | null>(null);
const isDragOver = ref(false);
const interaction = ref<Interaction | null>(null);

const allowedTypes: ElementType[] = ['heading', 'text', 'button', 'image', 'divider'];

const canvasStyle = computed<Record<string, string>>(() => ({
  width: `${store.currentTemplate.canvasSize.width}px`,
  height: `${store.currentTemplate.canvasSize.height}px`,
  backgroundColor: store.currentTemplate.backgroundColor
}));

function selectElement(id: string): void {
  store.selectElement(id);
}

function onCanvasMouseDown(event: MouseEvent): void {
  if (event.target === event.currentTarget) {
    store.selectElement(null);
  }
}

function onCanvasDragOver(event: DragEvent): void {
  event.preventDefault();
  isDragOver.value = true;
}

function onCanvasDragLeave(event: DragEvent): void {
  if (event.target === canvasRef.value) {
    isDragOver.value = false;
  }
}

function onCanvasDrop(event: DragEvent): void {
  event.preventDefault();
  isDragOver.value = false;
  if (!canvasRef.value) {
    return;
  }
  const rawType = event.dataTransfer?.getData(DRAG_MIME);
  if (!rawType || !allowedTypes.includes(rawType as ElementType)) {
    return;
  }

  const rect = canvasRef.value.getBoundingClientRect();
  const dropPosition = {
    x: event.clientX - rect.left,
    y: event.clientY - rect.top
  };
  store.addElement(rawType as ElementType, dropPosition);
}

function startDrag(payload: { id: string; mouseX: number; mouseY: number }): void {
  const element = store.currentTemplate.elements.find((entry) => entry.id === payload.id);
  if (!element) {
    return;
  }

  store.selectElement(payload.id);
  store.beginElementInteraction();
  interaction.value = {
    mode: 'drag',
    id: payload.id,
    startMouse: { x: payload.mouseX, y: payload.mouseY },
    startPosition: { ...element.position },
    size: { ...element.size }
  };
  bindPointerListeners();
}

function startResize(payload: { id: string; direction: ResizeDirection; mouseX: number; mouseY: number }): void {
  const element = store.currentTemplate.elements.find((entry) => entry.id === payload.id);
  if (!element) {
    return;
  }

  store.selectElement(payload.id);
  store.beginElementInteraction();
  interaction.value = {
    mode: 'resize',
    id: payload.id,
    direction: payload.direction,
    startMouse: { x: payload.mouseX, y: payload.mouseY },
    startPosition: { ...element.position },
    startSize: { ...element.size }
  };
  bindPointerListeners();
}

function onPointerMove(event: MouseEvent): void {
  if (!interaction.value) {
    return;
  }

  const canvasWidth = store.currentTemplate.canvasSize.width;
  const canvasHeight = store.currentTemplate.canvasSize.height;
  const deltaX = event.clientX - interaction.value.startMouse.x;
  const deltaY = event.clientY - interaction.value.startMouse.y;

  if (interaction.value.mode === 'drag') {
    const nextX = clamp(
      interaction.value.startPosition.x + deltaX,
      0,
      canvasWidth - interaction.value.size.width
    );
    const nextY = clamp(
      interaction.value.startPosition.y + deltaY,
      0,
      canvasHeight - interaction.value.size.height
    );
    store.moveElement(interaction.value.id, { x: nextX, y: nextY });
    return;
  }

  const resizeResult = getResizedRect(
    interaction.value.startPosition,
    interaction.value.startSize,
    interaction.value.direction,
    deltaX,
    deltaY,
    canvasWidth,
    canvasHeight
  );
  store.resizeElement(interaction.value.id, resizeResult.position, resizeResult.size);
}

function getResizedRect(
  startPosition: Position,
  startSize: Size,
  direction: ResizeDirection,
  deltaX: number,
  deltaY: number,
  canvasWidth: number,
  canvasHeight: number
): { position: Position; size: Size } {
  let left = startPosition.x;
  let top = startPosition.y;
  let right = startPosition.x + startSize.width;
  let bottom = startPosition.y + startSize.height;

  if (direction.includes('e')) {
    right = clamp(right + deltaX, left + MIN_WIDTH, canvasWidth);
  }
  if (direction.includes('s')) {
    bottom = clamp(bottom + deltaY, top + MIN_HEIGHT, canvasHeight);
  }
  if (direction.includes('w')) {
    left = clamp(left + deltaX, 0, right - MIN_WIDTH);
  }
  if (direction.includes('n')) {
    top = clamp(top + deltaY, 0, bottom - MIN_HEIGHT);
  }

  return {
    position: { x: left, y: top },
    size: { width: right - left, height: bottom - top }
  };
}

function stopInteraction(): void {
  interaction.value = null;
  unbindPointerListeners();
}

function bindPointerListeners(): void {
  window.addEventListener('mousemove', onPointerMove);
  window.addEventListener('mouseup', stopInteraction);
}

function unbindPointerListeners(): void {
  window.removeEventListener('mousemove', onPointerMove);
  window.removeEventListener('mouseup', stopInteraction);
}

onBeforeUnmount(() => {
  unbindPointerListeners();
});
</script>

<template>
  <div class="workspace-background">
    <div class="canvas-host">
      <div
        ref="canvasRef"
        class="canvas"
        :class="{ 'canvas-drop-active': isDragOver }"
        :style="canvasStyle"
        @mousedown="onCanvasMouseDown"
        @dragover="onCanvasDragOver"
        @dragleave="onCanvasDragLeave"
        @drop="onCanvasDrop"
      >
        <CanvasElement
          v-for="element in store.currentTemplate.elements"
          :key="element.id"
          :element="element"
          :selected="element.id === store.selectedElementId"
          @select="selectElement"
          @start-drag="startDrag"
          @start-resize="startResize"
        />
      </div>
    </div>
  </div>
</template>

<style scoped>
.workspace-background {
  flex: 1;
  padding: 24px;
  background: #e5e7eb;
  border-radius: 10px;
  overflow: auto;
}

.canvas-host {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100%;
}

.canvas {
  position: relative;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  border: 1px solid #e5e7eb;
}

.canvas-drop-active {
  outline: 2px dashed #2563eb;
  outline-offset: 4px;
}
</style>
