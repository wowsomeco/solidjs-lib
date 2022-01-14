import { onCleanup } from 'solid-js';

const clickOutside = (el: HTMLElement, accessor: any): void => {
  const onClick = (e) => !el.contains(e.target) && accessor()?.();
  document.body.addEventListener('click', onClick);

  onCleanup(() => document.body.removeEventListener('click', onClick));
};

export default clickOutside;
