import { onCleanup, onMount } from 'solid-js';

import Hoverable from '../utils/hoverable';

export interface HoverOptions {
  onEnter?: (el: HTMLElement) => void;
  onLeave?: (el: HTMLElement) => void;
}

const hover = (el: HTMLElement, value: () => HoverOptions): void => {
  let hoverable: Hoverable;

  onMount(() => {
    const { onEnter, onLeave } = value();
    hoverable = new Hoverable(el, {
      onEnter: () => onEnter?.(el),
      onLeave: () => onLeave?.(el)
    });
  });

  onCleanup(() => {
    hoverable?.cleanup();
  });
};

export default hover;
