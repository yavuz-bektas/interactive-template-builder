<script setup lang="ts">
import { computed } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';
import type { Alignment } from '@/types/template';

const store = useTemplateStore();
const selectedElement = computed(() => store.selectedElement);

function parseNumber(value: string, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

function updateTextContent(value: string): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'heading' || element.type === 'text') {
      element.content = value;
    }
  });
}

function updateFontSize(value: string): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'heading' || element.type === 'text') {
      element.fontSize = parseNumber(value, element.fontSize);
    }
  });
}

function updateTextColor(value: string): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'heading' || element.type === 'text') {
      element.color = value;
    }
  });
}

function updateAlignment(value: string): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'heading' || element.type === 'text') {
      element.alignment = value as Alignment;
    }
  });
}

function updateButtonText(value: string): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'button') {
      element.text = value;
    }
  });
}

function updateButtonBackground(value: string): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'button') {
      element.backgroundColor = value;
    }
  });
}

function updateButtonBackgroundHex(value: string): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'button') {
      element.backgroundColor = value;
    }
  });
}

function updateButtonTextColor(value: string): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'button') {
      element.textColor = value;
    }
  });
}

function updateButtonTextColorHex(value: string): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'button') {
      element.textColor = value;
    }
  });
}

function updateButtonRadius(value: number): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'button') {
      element.borderRadius = value;
    }
  });
}

function updateImageUrl(value: string): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'image') {
      element.url = value;
    }
  });
}

function updateImageAlt(value: string): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'image') {
      element.altText = value;
    }
  });
}

function updateDividerColor(value: string): void {
  store.patchSelectedElement((element) => {
    if (element.type === 'divider') {
      element.color = value;
    }
  });
}

function updatePositionX(value: string): void {
  store.patchSelectedElement((element) => {
    element.position.x = parseNumber(value, element.position.x);
  });
}

function updatePositionY(value: string): void {
  store.patchSelectedElement((element) => {
    element.position.y = parseNumber(value, element.position.y);
  });
}

function updateWidth(value: string): void {
  store.patchSelectedElement((element) => {
    element.size.width = parseNumber(value, element.size.width);
  });
}

function updateHeight(value: string): void {
  store.patchSelectedElement((element) => {
    element.size.height = parseNumber(value, element.size.height);
  });
}

function deleteSelectedElement(): void {
  store.deleteSelectedElement();
}

function capitalizeType(type: string): string {
  return type.charAt(0).toUpperCase() + type.slice(1);
}
</script>

<template>
  <section class="panel">
    <header class="panel-title">PROPERTIES</header>

    <template v-if="selectedElement">
      <span class="type-badge">{{ capitalizeType(selectedElement.type) }}</span>

      <template v-if="selectedElement.type === 'heading' || selectedElement.type === 'text'">
        <div class="group">
          <label class="field-label" for="content">Content</label>
          <textarea
            id="content"
            class="field-input"
            rows="3"
            :value="selectedElement.content"
            @input="updateTextContent(($event.target as HTMLTextAreaElement).value)"
          />
        </div>

        <div class="group">
          <label class="field-label" for="font-size">Font Size</label>
          <input
            id="font-size"
            class="field-input"
            :value="selectedElement.fontSize"
            min="8"
            max="90"
            type="number"
            @input="updateFontSize(($event.target as HTMLInputElement).value)"
          />
        </div>

        <div class="group">
          <label class="field-label" for="font-color">Color</label>
          <div class="color-row">
            <input
              id="font-color"
              class="color-swatch"
              :value="selectedElement.color"
              type="color"
              @input="updateTextColor(($event.target as HTMLInputElement).value)"
            />
            <input
              class="field-input color-hex"
              :value="selectedElement.color"
              type="text"
              @change="updateTextColor(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>

        <div class="group">
          <label class="field-label" for="align">Alignment</label>
          <select
            id="align"
            class="field-input"
            :value="selectedElement.alignment"
            @change="updateAlignment(($event.target as HTMLSelectElement).value)"
          >
            <option value="left">Left</option>
            <option value="center">Center</option>
            <option value="right">Right</option>
          </select>
        </div>
      </template>

      <template v-else-if="selectedElement.type === 'button'">
        <div class="group">
          <label class="field-label" for="button-text">Text</label>
          <input
            id="button-text"
            class="field-input"
            :value="selectedElement.text"
            type="text"
            @input="updateButtonText(($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="group">
          <label class="field-label" for="button-background">Background Color</label>
          <div class="color-row">
            <input
              id="button-background"
              class="color-swatch"
              :value="selectedElement.backgroundColor"
              type="color"
              @input="updateButtonBackground(($event.target as HTMLInputElement).value)"
            />
            <input
              class="field-input color-hex"
              :value="selectedElement.backgroundColor"
              type="text"
              @change="updateButtonBackgroundHex(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
        <div class="group">
          <label class="field-label" for="button-text-color">Text Color</label>
          <div class="color-row">
            <input
              id="button-text-color"
              class="color-swatch"
              :value="selectedElement.textColor"
              type="color"
              @input="updateButtonTextColor(($event.target as HTMLInputElement).value)"
            />
            <input
              class="field-input color-hex"
              :value="selectedElement.textColor"
              type="text"
              @change="updateButtonTextColorHex(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
        <div class="group">
          <label class="field-label">Border Radius</label>
          <div class="slider-row">
            <input
              class="slider"
              type="range"
              min="0"
              max="100"
              :value="selectedElement.borderRadius"
              @input="updateButtonRadius(Number(($event.target as HTMLInputElement).value))"
            />
            <span class="slider-value">{{ selectedElement.borderRadius }}px</span>
          </div>
        </div>
      </template>

      <template v-else-if="selectedElement.type === 'image'">
        <div class="group">
          <label class="field-label" for="image-url">Image URL</label>
          <input
            id="image-url"
            class="field-input"
            :value="selectedElement.url"
            type="url"
            @input="updateImageUrl(($event.target as HTMLInputElement).value)"
          />
        </div>
        <div class="group">
          <label class="field-label" for="image-alt">Alt Text</label>
          <input
            id="image-alt"
            class="field-input"
            :value="selectedElement.altText"
            type="text"
            @input="updateImageAlt(($event.target as HTMLInputElement).value)"
          />
        </div>
      </template>

      <template v-else>
        <div class="group">
          <label class="field-label" for="divider-color">Color</label>
          <div class="color-row">
            <input
              id="divider-color"
              class="color-swatch"
              :value="selectedElement.color"
              type="color"
              @input="updateDividerColor(($event.target as HTMLInputElement).value)"
            />
            <input
              class="field-input color-hex"
              :value="selectedElement.color"
              type="text"
              @change="updateDividerColor(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </template>

      <div class="group">
        <label class="field-label">Position</label>
        <div class="dual-row">
          <div class="dual-field">
            <span class="dual-label">X</span>
            <input
              class="field-input"
              type="number"
              :value="Math.round(selectedElement.position.x)"
              @change="updatePositionX(($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="dual-field">
            <span class="dual-label">Y</span>
            <input
              class="field-input"
              type="number"
              :value="Math.round(selectedElement.position.y)"
              @change="updatePositionY(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>

      <div class="group">
        <label class="field-label">Size</label>
        <div class="dual-row">
          <div class="dual-field">
            <span class="dual-label">Width</span>
            <input
              class="field-input"
              type="number"
              :value="Math.round(selectedElement.size.width)"
              @change="updateWidth(($event.target as HTMLInputElement).value)"
            />
          </div>
          <div class="dual-field">
            <span class="dual-label">Height</span>
            <input
              class="field-input"
              type="number"
              :value="Math.round(selectedElement.size.height)"
              @change="updateHeight(($event.target as HTMLInputElement).value)"
            />
          </div>
        </div>
      </div>

      <button class="delete-button" type="button" @click="deleteSelectedElement">Delete Element</button>
    </template>

    <p v-else class="empty-state">Select an element on the canvas to edit properties.</p>
  </section>
</template>

<style scoped>
.panel {
  padding: 16px;
}

.panel-title {
  font-weight: 700;
  font-size: 12px;
  letter-spacing: 0.08em;
  color: #6b7280;
  margin-bottom: 16px;
}

.type-badge {
  display: inline-block;
  background: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  padding: 4px 12px;
  font-size: 13px;
  font-weight: 600;
  color: #374151;
  margin-bottom: 16px;
}

.group {
  display: grid;
  gap: 6px;
  margin-bottom: 14px;
}

.field-label {
  font-size: 12px;
  font-weight: 600;
  color: #374151;
}

.field-input {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 8px 10px;
  font-size: 14px;
  width: 100%;
  min-height: 36px;
  font-family: inherit;
}

textarea.field-input {
  resize: vertical;
}

.color-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.color-swatch {
  width: 36px;
  height: 36px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  padding: 2px;
  cursor: pointer;
  flex-shrink: 0;
}

.color-hex {
  flex: 1;
}

.slider-row {
  display: flex;
  align-items: center;
  gap: 10px;
}

.slider {
  flex: 1;
  accent-color: #2563eb;
}

.slider-value {
  font-size: 13px;
  color: #374151;
  min-width: 36px;
  text-align: right;
}

.dual-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px;
}

.dual-field {
  display: grid;
  gap: 4px;
}

.dual-label {
  font-size: 11px;
  color: #6b7280;
  font-weight: 500;
}

.delete-button {
  width: 100%;
  border: 1px solid #ef4444;
  color: #ef4444;
  background: #ffffff;
  border-radius: 7px;
  padding: 10px 12px;
  font-weight: 600;
  font-size: 14px;
  cursor: pointer;
  margin-top: 8px;
}

.delete-button:hover {
  background: #fef2f2;
}

.empty-state {
  font-size: 13px;
  color: #6b7280;
}
</style>
