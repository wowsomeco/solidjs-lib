import type { MoveOptions } from './pointerListener';
import PointerListener from './pointerListener';

export interface DraggableOptions {
  onDragStart?: (e: Event) => void;
  onDragging?: (o: MoveOptions) => void;
  onDragEnd?: (e: Event) => void;
}

export default class Draggable {
  static init(el: HTMLElement, options: DraggableOptions): Draggable {
    return new Draggable(el, options);
  }

  private _pointer: PointerListener;
  private _shouldDrag = false;
  private _hasDragged = false;

  constructor(_el: HTMLElement, private _options: DraggableOptions) {
    _el.style.willChange = 'transform';

    this._pointer = new PointerListener(_el, {
      onDown: this._handleDragStart,
      onMove: this._handleDrag,
      onUp: this._handleDragEnd
    });
  }

  cleanup = () => {
    this._pointer?.cleanup();
  };

  private _handleDragStart = (e: Event) => {
    // dont process left click
    if (e instanceof MouseEvent && e.button !== 0) {
      return;
    }

    e.stopImmediatePropagation();
    e.preventDefault();
    // disable body scroll
    document.body.style.overflow = 'hidden';

    this._shouldDrag = true;

    this._options.onDragStart?.(e);
  };

  private _handleDrag = (o: MoveOptions) => {
    if (this._shouldDrag) {
      this._options.onDragging?.(o);
      this._hasDragged = true;
    }
  };

  private _handleDragEnd = (e: Event) => {
    if (this._shouldDrag) {
      // don't allow propagation if it's being dragged
      if (this._hasDragged) e.stopImmediatePropagation();

      e.preventDefault();

      this._shouldDrag = false;
      // enable back body scroll
      document.body.style.overflow = 'auto';

      this._hasDragged = false;

      this._options.onDragEnd?.(e);
    }
  };
}
