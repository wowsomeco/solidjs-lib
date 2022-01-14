import Observable from './observable';
import Timer from './timer';

export function lerp(v0: number, v1: number, t: number): number {
  return v0 * (1 - t) + v1 * t;
}

export type Easing =
  | 'Linear'
  | 'QuadIn'
  | 'QuadOut'
  | 'QuadInOut'
  | 'QuartIn'
  | 'QuartOut'
  | 'QuartInOut';

type EasingHandler = (k: number) => number;

const easings: Map<Easing, EasingHandler> = new Map([
  ['Linear', (k) => k],
  ['QuadIn', (k) => k * k],
  ['QuadOut', (k) => k * (2 - k)],
  [
    'QuadInOut',
    (k) => {
      if ((k *= 2) < 1) return 0.5 * k * k;
      return -0.5 * ((k -= 1) * (k - 2) - 1);
    }
  ],
  ['QuartIn', (k) => k * k * k * k],
  ['QuartOut', (k) => 1 - (k -= 1) * k * k * k],
  [
    'QuartInOut',
    (k) => {
      if ((k *= 2) < 1) return 0.5 * k * k * k * k;
      return -0.5 * ((k -= 2) * k * k * k - 2);
    }
  ]
]);

export interface Timing {
  duration: number;
  delay?: number;
  from: number;
  to: number;
  easing?: Easing;
}

export class Interpolation {
  static start(timing: Timing, onDone?: () => void): Interpolation {
    return new Interpolation(timing, onDone).start();
  }

  public current: Observable<number>;

  private _timer: Timer;
  private _easingHandler: EasingHandler;

  constructor(private _timing: Timing, private _onDone?: () => void) {
    this.current = new Observable<number>(this._timing.from);
    this._easingHandler = easings.get(_timing.easing ?? 'Linear');
  }

  start(): Interpolation {
    const delay = this._timing.delay;
    if (delay) {
      new Timer(delay, () => this._start());
    } else {
      this._start();
    }

    return this;
  }

  stop(): void {
    this._timer?.stop();
  }

  private _t(t: number): number {
    const newT = this._easingHandler(t);
    return newT;
  }

  private _start(): void {
    this._timer = new Timer(this._timing.duration, () => {
      this._timer.stop();
      this._onDone?.();
    });

    this._timer.progress.subscribe((v) => {
      const cur = lerp(this._timing.from, this._timing.to, this._t(v.t));
      this.current.next(cur);
    });
  }
}
