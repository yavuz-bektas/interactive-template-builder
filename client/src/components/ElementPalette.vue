<script setup lang="ts">
import type { ElementType } from '@/types/template';

const DRAG_MIME = 'application/x-template-element';

interface PaletteItem {
  type: ElementType;
  label: string;
  icon: string;
}

const items: PaletteItem[] = [
  { type: 'heading', label: 'Heading', icon: 'H' },
  { type: 'text', label: 'Text', icon: 'T' },
  { type: 'button', label: 'Button', icon: '☐' },
  { type: 'image', label: 'Image', icon: '▪' },
  { type: 'divider', label: 'Divider', icon: '—' }
];

function onDragStart(event: DragEvent, type: ElementType): void {
  if (!event.dataTransfer) {
    return;
  }
  event.dataTransfer.setData(DRAG_MIME, type);
  event.dataTransfer.effectAllowed = 'copy';
}
</script>

<template>
  <section class="palette">
    <header class="panel-title">ELEMENTS</header>
    <div class="palette-list">
      <button
        v-for="item in items"
        :key="item.type"
        class="palette-item"
        draggable="true"
        type="button"
        @dragstart="onDragStart($event, item.type)"
      >
        <span class="item-icon">{{ item.icon }}</span>
        <span class="item-label">{{ item.label }}</span>
      </button>
    </div>
  </section>
</template>

<style scoped>
.palette {
  padding: 16px 12px;
}

.panel-title {
  font-weight: 700;
  font-size: 11px;
  letter-spacing: 0.08em;
  color: #6b7280;
  margin-bottom: 14px;
}

.palette-list {
  display: grid;
  gap: 8px;
}

.palette-item {
  display: flex;
  align-items: center;
  gap: 10px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  background: #ffffff;
  cursor: grab;
  padding: 10px 12px;
  text-align: left;
  font-size: 14px;
  color: #111827;
  transition: border-color 0.15s, background 0.15s;
}

.palette-item:hover {
  border-color: #93c5fd;
  background: #eff6ff;
}

.item-icon {
  width: 24px;
  height: 24px;
  border-radius: 5px;
  background: #f3f4f6;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  color: #374151;
  flex-shrink: 0;
}

.item-label {
  font-weight: 500;
}
</style>
