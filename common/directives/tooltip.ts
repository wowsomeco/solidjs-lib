import 'tippy.js/dist/tippy.css';

import { onCleanup, onMount } from 'solid-js';
import tippy, { Instance, Placement } from 'tippy.js';

import Hoverable from '../utils/hoverable';

export interface TooltipOptions {
  text: string;
  disabled?: boolean;
  placement?: Placement;
}

const tooltip = (el: HTMLElement, value: () => TooltipOptions): void => {
  let tippyInstance: Instance;
  let hoverable: Hoverable;

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

    hoverable = new Hoverable(el, { onEnter: show, onLeave: hide });

    // hide initially
    hide();
  });

  onCleanup(() => {
    hoverable?.cleanup();

    tippyInstance?.destroy();
    tippyInstance = undefined;
  });
};

export default tooltip;
