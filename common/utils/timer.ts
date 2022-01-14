import Observable from './observable';

export interface Progress {
  t: number;
  percent: number;
}

export default class Timer {
  public progress: Observable<Progress> = new Observable<Progress>(undefined);

  private _timer = undefined;
  private _timestamp: number;
  private _current = 0;

  constructor(private _duration: number, private _done: () => void) {
    this._timestamp = Date.now();
    this.reset();
  }

  get t(): number {
    return this._current / this._duration;
  }

  get percent(): number {
    return Math.round(this.t * 100);
  }

  stop() {
    this._current = this._duration;
    window.cancelAnimationFrame(this._timer);
  }

  reset() {
    if (this._timer) this.stop();

    this._loop();
  }

  private _loop() {
    const dt = Date.now() - this._timestamp;
    this._timestamp = Date.now();
    this._timer = window.requestAnimationFrame(() => this._update(dt));
  }

  private _update(dt: number) {
    this._current += dt;
    if (this._current > this._duration) {
      this._done();
      this.stop();
    } else {
      this._loop();
    }

    this.progress.next({ t: this.t, percent: this.percent });
  }
}
