import { onCleanup, onMount } from 'solid-js';

import type { PointerListenerOptions } from '../utils/pointerListener';
import PointerListener from '../utils/pointerListener';

export type PointerOptions = PointerListenerOptions;

const pointer = (el: HTMLElement, value: () => PointerOptions): void => {
  let listener: PointerListener;

  onMount(() => {
    listener = new PointerListener(el, value());
  });

  onCleanup(() => {
    listener?.cleanup();
  });
};

export default pointer;
