import { mount } from '@vue/test-utils';
import CanvasElement from '@/components/CanvasElement.vue';
import type { ButtonElement } from '@/types/template';

describe('CanvasElement', () => {
  it('renders button text and styles from button props', () => {
    const button: ButtonElement = {
      id: 'button-1',
      type: 'button',
      position: { x: 40, y: 60 },
      size: { width: 170, height: 46 },
      text: 'Buy now',
      backgroundColor: '#123456',
      textColor: '#ffffff',
      borderRadius: 12
    };

    const wrapper = mount(CanvasElement, {
      props: {
        element: button,
        selected: false
      }
    });

    const buttonNode = wrapper.get('.button-content').element as HTMLElement;
    expect(wrapper.text()).toContain('Buy now');
    expect(buttonNode.style.backgroundColor).toBe('rgb(18, 52, 86)');
    expect(buttonNode.style.color).toBe('rgb(255, 255, 255)');
    expect(buttonNode.style.borderRadius).toBe('12px');
  });
});
