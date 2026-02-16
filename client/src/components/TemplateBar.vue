<script setup lang="ts">
import { ref, watch } from 'vue';
import { useTemplateStore } from '@/stores/templateStore';

const store = useTemplateStore();
const selectedTemplateId = ref('');

watch(
  () => store.activeTemplateId,
  (nextId) => {
    selectedTemplateId.value = nextId;
  },
  { immediate: true }
);

async function createNewTemplate(): Promise<void> {
  store.createNewTemplate();
  selectedTemplateId.value = '';
}

async function saveCurrentTemplate(): Promise<void> {
  const saved = await store.persistCurrentTemplate();
  if (saved) {
    selectedTemplateId.value = saved.id;
  }
}

function loadSelectedTemplate(): void {
  if (!selectedTemplateId.value) {
    return;
  }
  store.loadTemplateById(selectedTemplateId.value);
}

async function deleteSelectedTemplate(): Promise<void> {
  if (!selectedTemplateId.value) {
    return;
  }
  await store.removeTemplate(selectedTemplateId.value);
  selectedTemplateId.value = '';
}

function exportCurrentTemplate(): void {
  const content = JSON.stringify(store.currentTemplate, null, 2);
  const blob = new Blob([content], { type: 'application/json;charset=utf-8;' });
  const fileName = store.currentTemplate.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') || 'template';
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `${fileName}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
</script>

<template>
  <div class="bar-wrapper">
    <div class="bar-left">
      <button class="bar-btn" type="button" @click="createNewTemplate">+ New</button>
      <button class="bar-btn primary" type="button" @click="saveCurrentTemplate">Save</button>
      <button class="bar-btn" type="button" @click="exportCurrentTemplate">Export JSON</button>
    </div>
    <div class="bar-right">
      <span class="template-label">Template:</span>
      <select
        v-model="selectedTemplateId"
        class="template-select"
        @change="loadSelectedTemplate"
      >
        <option value="">Select template</option>
        <option v-for="template in store.templates" :key="template.id" :value="template.id">
          {{ template.name }}
        </option>
      </select>
    </div>
  </div>
</template>

<style scoped>
.bar-wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  gap: 12px;
}

.bar-left,
.bar-right {
  display: flex;
  gap: 8px;
  align-items: center;
}

.bar-btn {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  border-radius: 6px;
  padding: 6px 14px;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
}

.bar-btn.primary {
  background: #2563eb;
  border-color: #2563eb;
  color: #ffffff;
}

.bar-btn.primary:hover {
  background: #1d4ed8;
}

.template-label {
  font-size: 13px;
  color: #6b7280;
  white-space: nowrap;
}

.template-select {
  border: 1px solid #d1d5db;
  border-radius: 6px;
  min-width: 160px;
  padding: 6px 10px;
  font-size: 13px;
}
</style>
