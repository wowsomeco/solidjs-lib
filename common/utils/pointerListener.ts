import Vector2 from './vec2';

type Ev = TouchEvent | MouseEvent;

export interface MoveOptions {
  event: Ev;
  position: Vector2;
  delta: Vector2;
}

export interface PointerListenerOptions {
  onDown?: (e: Ev) => void;
  onMove?: (o: MoveOptions) => void;
  onUpInside?: (e: Ev) => void;
  onUpOutside?: (e: Ev) => void;
  onUp?: (e: Ev) => void;
}

const POINTER_DOWN = ['mousedown', 'touchstart'];
const POINTER_MOVE = ['mousemove', 'touchmove'];
const POINTER_UP = ['mouseup', 'touchend'];

/**
 * Unified pointer listener for both desktop and mobile platforms
 */
export default class PointerListener {
  private _lastDragPos = Vector2.zero();
  private _isFocus = false;

  constructor(
    private _el: HTMLElement,
    private _options: PointerListenerOptions
  ) {
    POINTER_DOWN.forEach((e) => _el.addEventListener(e, this._handleDown));
    POINTER_MOVE.forEach((e) => document.addEventListener(e, this._handleMove));
    POINTER_UP.forEach((e) => document.addEventListener(e, this._handleUp));
  }

  cleanup = () => {
    POINTER_DOWN.forEach((e) =>
      this._el.removeEventListener(e, this._handleDown)
    );
    POINTER_MOVE.forEach((e) =>
      document.removeEventListener(e, this._handleMove)
    );
    POINTER_UP.forEach((e) => document.removeEventListener(e, this._handleUp));
  };

  private _handleDown = (e: Ev) => {
    // dont process left click
    if (e instanceof MouseEvent && e.button !== 0) {
      return;
    }

    if (e instanceof MouseEvent) {
      this._lastDragPos = Vector2.create(e.pageX, e.pageY);
    } else {
      this._lastDragPos = Vector2.create(
        e.touches[0].pageX,
        e.touches[0].pageY
      );
    }

    this._isFocus = true;

    this._options.onDown?.(e);
  };

  private _handleMove = (ev: Ev) => {
    // get the delta touch x from the start x
    if (this._isFocus) {
      let curX = 0,
        curY = 0;

      if (ev instanceof MouseEvent) {
        curX = ev.pageX;
        curY = ev.pageY;
      } else {
        curX = ev.touches[0].pageX;
        curY = ev.touches[0].pageY;
      }

      const deltaX = curX - this._lastDragPos.x;
      const deltaY = curY - this._lastDragPos.y;

      this._options.onMove?.({
        position: this._lastDragPos,
        delta: new Vector2(deltaX, deltaY),
        event: ev
      });

      this._lastDragPos = new Vector2(curX, curY);
    }
  };

  private _handleUp = (ev: Ev) => {
    if (this._isFocus) {
      const isInside = this._el.contains(ev.target as Element);

      if (isInside) {
        this._options.onUpInside?.(ev);
      } else {
        this._options.onUpOutside?.(ev);
      }

      this._options.onUp?.(ev);

      this._isFocus = false;
    }
  };
}
