import { onCleanup } from 'solid-js';

import { Interpolation, lerp } from '~lib/common/utils/interpolations';

type TweenTarget = 'x' | 'y' | 'opacity';

export interface Tween {
  from: number;
  to: number;
}

export interface TweenStep {
  duration: number;
  tweens?: Map<TweenTarget, Tween>;
}

export interface TransitionOptions {
  steps: TweenStep[];
  onDone?: () => void;
}

const curT = (
  tweens: Map<TweenTarget, Tween>,
  key: TweenTarget,
  t: number,
  defaultValue: number = 0
): number => {
  if (tweens.has(key)) {
    const tw = tweens.get(key);
    return lerp(tw.from, tw.to, t);
  }

  return defaultValue;
};

const transition = (el: HTMLElement, value: () => TransitionOptions): void => {
  el.style.willChange = 'transform,opacity';

  const { steps: chains, onDone } = value();

  let currentStep = 0;
  let interpolation: Interpolation = null;

  const play = () => {
    const { duration, tweens = new Map() } = chains[currentStep];
    interpolation = Interpolation.start({ duration, from: 0, to: 1 }, () => {
      if (currentStep < chains.length - 1) {
        currentStep++;
        play();
      } else {
        onDone?.();
        interpolation = null;
      }
    });

    interpolation.current.subscribe((t) => {
      const x = curT(tweens, 'x', t);
      const y = curT(tweens, 'y', t);
      const alpha = curT(tweens, 'opacity', t, 1);

      el.style.cssText = `
        transform: translate3d(${x}px, ${y}px, 0);      
        opacity: ${alpha};
      `;
    });
  };

  play();

  onCleanup(() => interpolation?.stop());
};

export default transition;
