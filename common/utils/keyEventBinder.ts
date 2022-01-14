type KeyPressType = 'keyup' | 'keydown';

type KeyEventType =
  | 'Escape'
  | 'Enter'
  | 'ArrowDown'
  | 'ArrowUp'
  | 'ArrowRight'
  | 'ArrowLeft'
  | 'Control';

type EventCallback = (ev: KeyboardEvent) => void;

const keyMappers = new Map<KeyEventType, string[]>([
  ['Escape', ['Escape', 'Esc']],
  ['Enter', ['Enter']],
  ['ArrowUp', ['Up', 'ArrowUp']],
  ['ArrowDown', ['Down', 'ArrowDown']],
  ['ArrowLeft', ['Left', 'ArrowLeft']],
  ['ArrowRight', ['Right', 'ArrowRight']]
]);

export class KeyEventBinder {
  static init(): KeyEventBinder {
    return new KeyEventBinder();
  }

  private _kv: Map<KeyPressType, EventCallback[]> = new Map();

  on(
    ev: KeyPressType,
    keys: KeyEventType[],
    callback: () => boolean
  ): KeyEventBinder {
    // init if doesn't exist yet
    if (!this._kv.has(ev)) {
      this._kv.set(ev, []);
    }

    const cb = (event: KeyboardEvent) => {
      if (event.defaultPrevented) {
        // Do nothing if the event was already processed
        return;
      }

      keys.forEach((key) => {
        if (keyMappers.get(key).includes(event.key)) {
          // preventDefault only when the callback returns true
          if (callback()) event.preventDefault();
        }
      });
    };
    // add event listener to document
    document.addEventListener(ev, cb);

    this._kv.get(ev).push(cb);

    return this;
  }

  /** Call this to clean up all the events that were added in on() method previously */
  remove(): void {
    for (const [key, value] of this._kv) {
      value.forEach((v) => document.removeEventListener(key, v));
    }

    this._kv = new Map();
  }
}
