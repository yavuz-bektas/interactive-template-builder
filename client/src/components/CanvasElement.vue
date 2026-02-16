<script setup lang="ts">
import { computed } from 'vue';
import ResizeHandles from '@/components/ResizeHandles.vue';
import type { ResizeDirection, TemplateElement } from '@/types/template';

const props = defineProps<{
  element: TemplateElement;
  selected: boolean;
}>();

const emit = defineEmits<{
  select: [id: string];
  startDrag: [{ id: string; mouseX: number; mouseY: number }];
  startResize: [{ id: string; direction: ResizeDirection; mouseX: number; mouseY: number }];
}>();

const elementStyle = computed<Record<string, string>>(() => ({
  left: `${props.element.position.x}px`,
  top: `${props.element.position.y}px`,
  width: `${props.element.size.width}px`,
  height: `${props.element.size.height}px`
}));

function onMouseDown(event: MouseEvent): void {
  if (event.button !== 0) {
    return;
  }
  event.preventDefault();
  event.stopPropagation();
  emit('select', props.element.id);
  emit('startDrag', {
    id: props.element.id,
    mouseX: event.clientX,
    mouseY: event.clientY
  });
}

function onResize(payload: { direction: ResizeDirection; mouseX: number; mouseY: number }): void {
  emit('startResize', {
    id: props.element.id,
    direction: payload.direction,
    mouseX: payload.mouseX,
    mouseY: payload.mouseY
  });
}
</script>

<template>
  <div class="canvas-element" :class="{ selected }" :style="elementStyle" @mousedown="onMouseDown">
    <template v-if="element.type === 'heading'">
      <div
        class="heading-content"
        :style="{
          color: element.color,
          fontSize: `${element.fontSize}px`,
          textAlign: element.alignment
        }"
      >
        {{ element.content }}
      </div>
    </template>

    <template v-else-if="element.type === 'text'">
      <div
        class="text-content"
        :style="{
          color: element.color,
          fontSize: `${element.fontSize}px`,
          textAlign: element.alignment
        }"
      >
        {{ element.content }}
      </div>
    </template>

    <template v-else-if="element.type === 'button'">
      <div
        class="button-content"
        :style="{
          backgroundColor: element.backgroundColor,
          color: element.textColor,
          borderRadius: `${element.borderRadius}px`
        }"
      >
        {{ element.text }}
      </div>
    </template>

    <template v-else-if="element.type === 'image'">
      <img
        v-if="element.url"
        class="image-content"
        :src="element.url"
        :alt="element.altText || 'image'"
        draggable="false"
      />
      <div v-else class="image-placeholder">{{ Math.round(element.size.width) }} x {{ Math.round(element.size.height) }}</div>
    </template>

    <template v-else>
      <div class="divider-content" :style="{ backgroundColor: element.color }"></div>
    </template>

    <ResizeHandles v-if="selected" @start-resize="onResize" />
  </div>
</template>

<style scoped>
.canvas-element {
  position: absolute;
  user-select: none;
  border: 1px solid transparent;
}

.canvas-element.selected {
  border: 1px dashed #2563eb;
}

.heading-content,
.text-content {
  width: 100%;
  height: 100%;
  overflow: hidden;
  word-break: break-word;
}

.heading-content {
  font-weight: 700;
  line-height: 1.2;
}

.text-content {
  line-height: 1.4;
}

.button-content {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  pointer-events: none;
}

.image-content {
  width: 100%;
  height: 100%;
  object-fit: cover;
  pointer-events: none;
}

.image-placeholder {
  width: 100%;
  height: 100%;
  border: 1px dashed #9ca3af;
  background: #f9fafb;
  color: #6b7280;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  text-align: center;
  padding: 8px;
}

.divider-content {
  width: 100%;
  height: 100%;
}
</style>
