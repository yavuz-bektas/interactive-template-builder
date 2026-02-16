import { createPinia, setActivePinia } from 'pinia';
import { useTemplateStore } from '@/stores/templateStore';

describe('template store history', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('adds an element and restores state with undo/redo', () => {
    const store = useTemplateStore();

    const elementId = store.addElement('heading', { x: 25, y: 30 });
    expect(store.currentTemplate.elements).toHaveLength(1);
    expect(store.currentTemplate.elements[0]?.id).toBe(elementId);

    store.undo();
    expect(store.currentTemplate.elements).toHaveLength(0);

    store.redo();
    expect(store.currentTemplate.elements).toHaveLength(1);
    expect(store.currentTemplate.elements[0]?.id).toBe(elementId);
  });
});
