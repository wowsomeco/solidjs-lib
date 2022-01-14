import clsx from 'clsx';
import type { Component } from 'solid-js';
import { onCleanup, onMount } from 'solid-js';

import type { CommonProps } from '~components/props';
import { Interpolation } from '~lib/common/utils/interpolations';

interface SkeletonProps extends CommonProps {
  /** Fading duration in ms */
  fadeDuration?: number;
}

const Skeleton: Component<SkeletonProps> = (props: SkeletonProps) => {
  let el: HTMLDivElement;
  let interpolation: Interpolation;

  const animate = () => {
    const duration = props.fadeDuration ?? 500;

    interpolation = Interpolation.start(
      { delay: duration, duration, from: 0, to: 1, easing: 'QuadOut' },
      () => {
        animate();
      }
    );

    interpolation.current.subscribe((t) => {
      el.style.cssText = `
        opacity: ${t};
      `;
    });
  };

  onMount(() => {
    el.style.willChange = 'opacity';
    animate();
  });

  onCleanup(() => {
    interpolation?.stop();
  });

  return <div ref={el} class={clsx(props.class)}></div>;
};

export default Skeleton;
