import type { Instance } from '@popperjs/core';
import { createPopper, Placement } from '@popperjs/core';
import clsx from 'clsx';
import { onCleanup, onMount } from 'solid-js';

export interface TooltipOptions {
  text: string;
  disabled?: boolean;
  placement?: Placement;
  cls?: string;
}

const tooltip = (el: HTMLElement, value: () => TooltipOptions): void => {
  let popperInstance: Instance;

  onMount(() => {
    const {
      text,
      placement = 'top',
      cls = 'border rounded p-1 bg-gray-700	text-gray-50',
      disabled = false
    } = value();

    if (disabled) return;

    const tooltipEl = document.createElement('div');
    tooltipEl.innerHTML = text;
    tooltipEl.className = clsx(cls);
    document.body.appendChild(tooltipEl);

    popperInstance = createPopper(el, tooltipEl, {
      placement,
      modifiers: [
        {
          name: 'offset',
          options: {
            offset: [0, 8]
          }
        }
      ]
    });

    const show = () => {
      tooltipEl.style.display = 'block';
      popperInstance.update();
    };

    const hide = () => {
      tooltipEl.style.display = 'none';
    };

    const showEvents = ['mouseenter', 'focus'];
    const hideEvents = ['mouseleave', 'blur'];

    showEvents.forEach((event) => {
      el.addEventListener(event, show);
    });

    hideEvents.forEach((event) => {
      el.addEventListener(event, hide);
    });

    // hide initially
    hide();
  });

  onCleanup(() => {
    popperInstance?.destroy();
  });
};

export default tooltip;
