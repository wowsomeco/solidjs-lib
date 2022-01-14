import { onMount } from 'solid-js';

const ripple = (el: HTMLElement): void => {
  let circle: HTMLSpanElement = null;

  onMount(() => {
    const diameter = Math.max(el.clientWidth, el.clientHeight);
    const radius = diameter / 2;

    el.addEventListener('click', (ev) => {
      // remove span el, if already exists previously
      if (circle) {
        circle.remove();
      }

      circle = document.createElement('span');
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${ev.clientX - (el.offsetLeft + radius)}px`;
      circle.style.top = `${ev.clientY - (el.offsetTop + radius)}px`;
      circle.classList.add('ripple');

      el.appendChild(circle);
    });
  });
};

export default ripple;
