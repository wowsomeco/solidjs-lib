import 'tippy.js/dist/tippy.css';

import { onCleanup, onMount } from 'solid-js';
import tippy, { Instance, Placement } from 'tippy.js';

export interface TooltipOptions {
  text: string;
  disabled?: boolean;
  placement?: Placement;
}

const tooltip = (el: HTMLElement, value: () => TooltipOptions): void => {
  let tippyInstance: Instance;

  onMount(() => {
    const { text, placement = 'top', disabled = false } = value();

    if (disabled) return;

    tippyInstance = tippy(el, {
      placement,
      content: text
    });

    const show = () => {
      tippyInstance?.show();
    };

    const hide = () => {
      tippyInstance?.hide();
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
    tippyInstance?.destroy();
    tippyInstance = undefined;
  });
};

export default tooltip;
