const ENTER_EVENTS = ['mouseenter', 'focus'];
const LEAVE_EVENTS = ['mouseleave', 'blur'];

export interface HoverableOptions {
  onEnter?: (e: Event) => void;
  onLeave?: (e: Event) => void;
}

export default class Hoverable {
  constructor(private _el: HTMLElement, private _options: HoverableOptions) {
    ENTER_EVENTS.forEach((e) => _el.addEventListener(e, this._onHoverEnter));
    LEAVE_EVENTS.forEach((e) => _el.addEventListener(e, this._onHoverLeave));
  }

  cleanup = () => {
    ENTER_EVENTS.forEach((e) =>
      this._el.removeEventListener(e, this._onHoverEnter)
    );

    LEAVE_EVENTS.forEach((e) =>
      this._el.removeEventListener(e, this._onHoverLeave)
    );
  };

  private _onHoverEnter = (e: Event) => {
    this._options.onEnter?.(e);
  };

  private _onHoverLeave = (e: Event) => {
    this._options.onLeave?.(e);
  };
}
