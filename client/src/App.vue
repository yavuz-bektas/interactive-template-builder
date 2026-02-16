<script setup lang="ts">
import { onBeforeUnmount, onMounted } from 'vue';
import AppLayout from '@/components/AppLayout.vue';
import CanvasArea from '@/components/CanvasArea.vue';
import ElementPalette from '@/components/ElementPalette.vue';
import PropertiesPanel from '@/components/PropertiesPanel.vue';
import TemplateBar from '@/components/TemplateBar.vue';
import { useTemplateStore } from '@/stores/templateStore';

const store = useTemplateStore();

function handleKeyDown(event: KeyboardEvent): void {
  const target = event.target as HTMLElement | null;
  const isFieldTarget =
    !!target &&
    (target instanceof HTMLInputElement ||
      target instanceof HTMLTextAreaElement ||
      target instanceof HTMLSelectElement ||
      target.isContentEditable);

  if ((event.key === 'Delete' || event.key === 'Backspace') && !isFieldTarget) {
    event.preventDefault();
    store.deleteSelectedElement();
    return;
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'z') {
    event.preventDefault();
    if (event.shiftKey) {
      store.redo();
    } else {
      store.undo();
    }
    return;
  }

  if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'y') {
    event.preventDefault();
    store.redo();
    return;
  }

  if (isFieldTarget || !store.selectedElementId) {
    return;
  }

  const step = event.shiftKey ? 5 : 1;
  if (event.key === 'ArrowLeft') {
    event.preventDefault();
    store.moveSelectedBy(-step, 0);
  } else if (event.key === 'ArrowRight') {
    event.preventDefault();
    store.moveSelectedBy(step, 0);
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    store.moveSelectedBy(0, -step);
  } else if (event.key === 'ArrowDown') {
    event.preventDefault();
    store.moveSelectedBy(0, step);
  }
}

onMounted(async () => {
  await store.refreshTemplates();
  window.addEventListener('keydown', handleKeyDown);
});

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeyDown);
});
</script>

<template>
  <AppLayout>
    <template #header>
      <h1 class="app-title">Interactive Template Builder</h1>
      <div class="history-controls">
        <button class="header-btn" :disabled="!store.canUndo" @click="store.undo">
          <span class="btn-icon">↩</span> Undo
        </button>
        <button class="header-btn" :disabled="!store.canRedo" @click="store.redo">
          <span class="btn-icon">↪</span> Redo
        </button>
      </div>
    </template>

    <template #left>
      <ElementPalette />
    </template>

    <template #center>
      <section class="builder">
        <CanvasArea />

        <div class="layer-controls">
          <button class="layer-btn" :disabled="!store.selectedElementId" @click="store.bringForward">
            ↑ Bring Forward
          </button>
          <button class="layer-btn" :disabled="!store.selectedElementId" @click="store.sendBackward">
            ↓ Send Backward
          </button>
        </div>
      </section>
    </template>

    <template #right>
      <PropertiesPanel />
    </template>

    <template #footer>
      <TemplateBar />
    </template>
  </AppLayout>
</template>

<style scoped>
.app-title {
  margin: 0;
  font-size: 18px;
  font-weight: 700;
  color: #111827;
}

.history-controls {
  display: flex;
  gap: 6px;
}

.header-btn {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  border-radius: 6px;
  padding: 6px 12px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.header-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 14px;
}

.builder {
  flex: 1;
  display: flex;
  flex-direction: column;
  padding: 16px;
  min-height: 0;
}

.layer-controls {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 12px;
}

.layer-btn {
  border: 1px solid #d1d5db;
  background: #ffffff;
  color: #111827;
  border-radius: 6px;
  padding: 7px 14px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
}

.layer-btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.error-text {
  margin-top: 10px;
  color: #b91c1c;
  font-size: 13px;
}
</style>
