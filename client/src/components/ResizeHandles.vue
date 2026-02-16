<script setup lang="ts">
import type { ResizeDirection } from '@/types/template';

const emit = defineEmits<{
  startResize: [{ direction: ResizeDirection; mouseX: number; mouseY: number }];
}>();

const directions: ResizeDirection[] = ['nw', 'ne', 'sw', 'se'];

function onHandleMouseDown(event: MouseEvent, direction: ResizeDirection): void {
  event.preventDefault();
  event.stopPropagation();
  emit('startResize', {
    direction,
    mouseX: event.clientX,
    mouseY: event.clientY
  });
}
</script>

<template>
  <div class="resize-layer">
    <button
      v-for="direction in directions"
      :key="direction"
      :class="['resize-handle', `resize-handle-${direction}`]"
      type="button"
      @mousedown="onHandleMouseDown($event, direction)"
    />
  </div>
</template>

<style scoped>
.resize-layer {
  position: absolute;
  inset: 0;
  pointer-events: none;
}

.resize-handle {
  pointer-events: auto;
  position: absolute;
  width: 10px;
  height: 10px;
  border: 1px solid #2563eb;
  background: #ffffff;
  border-radius: 2px;
  padding: 0;
}

.resize-handle-nw {
  top: -6px;
  left: -6px;
  cursor: nwse-resize;
}

.resize-handle-ne {
  top: -6px;
  right: -6px;
  cursor: nesw-resize;
}

.resize-handle-sw {
  bottom: -6px;
  left: -6px;
  cursor: nesw-resize;
}

.resize-handle-se {
  right: -6px;
  bottom: -6px;
  cursor: nwse-resize;
}
</style>
