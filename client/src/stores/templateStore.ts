import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import { deleteTemplate, listTemplates, saveTemplate } from '@/utils/api';
import {
  clamp,
  clampPosition,
  cloneTemplate,
  createElement,
  createTemplate
} from '@/utils/template';
import type { ElementType, Position, Size, Template, TemplateElement } from '@/types/template';

const HISTORY_LIMIT = 120;
const MIN_WIDTH = 40;
const MIN_HEIGHT = 24;

type ElementMutator = (element: TemplateElement) => void;

export const useTemplateStore = defineStore('template', () => {
  const templates = ref<Template[]>([]);
  const currentTemplate = ref<Template>(createTemplate());
  const selectedElementId = ref<string | null>(null);
  const activeTemplateId = ref<string>('');
  const historyPast = ref<Template[]>([]);
  const historyFuture = ref<Template[]>([]);
  const isLoading = ref(false);
  const errorMessage = ref<string>('');

  const selectedElement = computed<TemplateElement | null>(() => {
    if (!selectedElementId.value) {
      return null;
    }

    return (
      currentTemplate.value.elements.find((element) => element.id === selectedElementId.value) ?? null
    );
  });

  const canUndo = computed<boolean>(() => historyPast.value.length > 0);
  const canRedo = computed<boolean>(() => historyFuture.value.length > 0);

  function setError(error: unknown): void {
    errorMessage.value = error instanceof Error ? error.message : 'Unknown error';
  }

  function clearError(): void {
    errorMessage.value = '';
  }

  function touchTemplate(): void {
    currentTemplate.value.updatedAt = new Date().toISOString();
  }

  function resetHistory(): void {
    historyPast.value = [];
    historyFuture.value = [];
  }

  function captureHistorySnapshot(): void {
    historyPast.value.push(cloneTemplate(currentTemplate.value));
    if (historyPast.value.length > HISTORY_LIMIT) {
      historyPast.value.shift();
    }
    historyFuture.value = [];
  }

  function setCurrentTemplate(template: Template): void {
    currentTemplate.value = cloneTemplate(template);
    activeTemplateId.value = template.id;
    selectedElementId.value = null;
    resetHistory();
  }

  function createNewTemplate(name = 'Untitled Template'): void {
    currentTemplate.value = createTemplate(name);
    selectedElementId.value = null;
    activeTemplateId.value = '';
    resetHistory();
    clearError();
  }

  function setTemplateName(name: string): void {
    captureHistorySnapshot();
    currentTemplate.value.name = name || 'Untitled Template';
    touchTemplate();
  }

  function setCanvasBackgroundColor(color: string): void {
    captureHistorySnapshot();
    currentTemplate.value.backgroundColor = color;
    touchTemplate();
  }

  function selectElement(id: string | null): void {
    selectedElementId.value = id;
  }

  function getElementById(id: string): TemplateElement | undefined {
    return currentTemplate.value.elements.find((element) => element.id === id);
  }

  function patchElementById(id: string, mutator: ElementMutator, recordHistory = true): void {
    const element = getElementById(id);
    if (!element) {
      return;
    }

    if (recordHistory) {
      captureHistorySnapshot();
    }

    mutator(element);

    element.size.width = clamp(element.size.width, MIN_WIDTH, currentTemplate.value.canvasSize.width);
    const minHeight = element.type === 'divider' ? 2 : MIN_HEIGHT;
    element.size.height = clamp(element.size.height, minHeight, currentTemplate.value.canvasSize.height);
    element.position = clampPosition(
      element.position,
      element.size.width,
      element.size.height,
      currentTemplate.value.canvasSize.width,
      currentTemplate.value.canvasSize.height
    );
    if (element.type === 'divider') {
      element.size.height = 2;
    }
    touchTemplate();
  }

  function patchSelectedElement(mutator: ElementMutator, recordHistory = true): void {
    if (!selectedElementId.value) {
      return;
    }
    patchElementById(selectedElementId.value, mutator, recordHistory);
  }

  function addElement(type: ElementType, dropPosition: Position): string {
    const element = createElement(type, dropPosition);
    element.position = clampPosition(
      dropPosition,
      element.size.width,
      element.size.height,
      currentTemplate.value.canvasSize.width,
      currentTemplate.value.canvasSize.height
    );
    captureHistorySnapshot();
    currentTemplate.value.elements.push(element);
    selectedElementId.value = element.id;
    touchTemplate();
    return element.id;
  }

  function deleteSelectedElement(): void {
    if (!selectedElementId.value) {
      return;
    }

    captureHistorySnapshot();
    currentTemplate.value.elements = currentTemplate.value.elements.filter(
      (element) => element.id !== selectedElementId.value
    );
    selectedElementId.value = null;
    touchTemplate();
  }

  function moveSelectedBy(deltaX: number, deltaY: number): void {
    patchSelectedElement((element) => {
      element.position.x += deltaX;
      element.position.y += deltaY;
    });
  }

  function beginElementInteraction(): void {
    captureHistorySnapshot();
  }

  function moveElement(id: string, position: Position): void {
    patchElementById(
      id,
      (element) => {
        element.position = position;
      },
      false
    );
  }

  function resizeElement(id: string, position: Position, size: Size): void {
    patchElementById(
      id,
      (element) => {
        element.position = position;
        element.size = size;
      },
      false
    );
  }

  function bringForward(): void {
    if (!selectedElementId.value) {
      return;
    }

    const currentIndex = currentTemplate.value.elements.findIndex(
      (element) => element.id === selectedElementId.value
    );
    if (currentIndex < 0 || currentIndex === currentTemplate.value.elements.length - 1) {
      return;
    }

    captureHistorySnapshot();
    const elements = [...currentTemplate.value.elements];
    const nextIndex = currentIndex + 1;
    [elements[currentIndex], elements[nextIndex]] = [elements[nextIndex], elements[currentIndex]];
    currentTemplate.value.elements = elements;
    touchTemplate();
  }

  function sendBackward(): void {
    if (!selectedElementId.value) {
      return;
    }

    const currentIndex = currentTemplate.value.elements.findIndex(
      (element) => element.id === selectedElementId.value
    );
    if (currentIndex <= 0) {
      return;
    }

    captureHistorySnapshot();
    const elements = [...currentTemplate.value.elements];
    const nextIndex = currentIndex - 1;
    [elements[currentIndex], elements[nextIndex]] = [elements[nextIndex], elements[currentIndex]];
    currentTemplate.value.elements = elements;
    touchTemplate();
  }

  function undo(): void {
    if (!canUndo.value) {
      return;
    }

    const previousTemplate = historyPast.value.pop();
    if (!previousTemplate) {
      return;
    }
    historyFuture.value.push(cloneTemplate(currentTemplate.value));
    currentTemplate.value = previousTemplate;
    if (
      selectedElementId.value &&
      !currentTemplate.value.elements.some((element) => element.id === selectedElementId.value)
    ) {
      selectedElementId.value = null;
    }
  }

  function redo(): void {
    if (!canRedo.value) {
      return;
    }

    const nextTemplate = historyFuture.value.pop();
    if (!nextTemplate) {
      return;
    }
    historyPast.value.push(cloneTemplate(currentTemplate.value));
    currentTemplate.value = nextTemplate;
    if (
      selectedElementId.value &&
      !currentTemplate.value.elements.some((element) => element.id === selectedElementId.value)
    ) {
      selectedElementId.value = null;
    }
  }

  function loadTemplateById(id: string): void {
    const template = templates.value.find((entry) => entry.id === id);
    if (!template) {
      return;
    }
    setCurrentTemplate(template);
  }

  async function refreshTemplates(): Promise<void> {
    isLoading.value = true;
    clearError();
    try {
      templates.value = await listTemplates();
    } catch (error) {
      setError(error);
    } finally {
      isLoading.value = false;
    }
  }

  async function persistCurrentTemplate(): Promise<Template | null> {
    isLoading.value = true;
    clearError();
    try {
      const savedTemplate = await saveTemplate(currentTemplate.value);
      currentTemplate.value = cloneTemplate(savedTemplate);
      activeTemplateId.value = savedTemplate.id;
      await refreshTemplates();
      return savedTemplate;
    } catch (error) {
      setError(error);
      return null;
    } finally {
      isLoading.value = false;
    }
  }

  async function removeTemplate(id: string): Promise<void> {
    isLoading.value = true;
    clearError();
    try {
      await deleteTemplate(id);
      templates.value = templates.value.filter((template) => template.id !== id);
      if (currentTemplate.value.id === id) {
        createNewTemplate();
      }
      if (activeTemplateId.value === id) {
        activeTemplateId.value = '';
      }
    } catch (error) {
      setError(error);
    } finally {
      isLoading.value = false;
    }
  }

  return {
    activeTemplateId,
    canRedo,
    canUndo,
    currentTemplate,
    errorMessage,
    historyFuture,
    historyPast,
    isLoading,
    selectedElement,
    selectedElementId,
    templates,
    addElement,
    beginElementInteraction,
    bringForward,
    captureHistorySnapshot,
    createNewTemplate,
    deleteSelectedElement,
    loadTemplateById,
    moveElement,
    moveSelectedBy,
    patchElementById,
    patchSelectedElement,
    persistCurrentTemplate,
    redo,
    refreshTemplates,
    removeTemplate,
    resizeElement,
    selectElement,
    sendBackward,
    setCanvasBackgroundColor,
    setTemplateName,
    undo
  };
});
