class Vector2 {
  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static create(x: number, y: number): Vector2 {
    return new Vector2(x, y);
  }

  static clone(other: Vector2): Vector2 {
    return new Vector2(other.x, other.y);
  }

  get x() {
    return this._x;
  }

  set x(v: number) {
    this._x = v;
  }

  get y() {
    return this._y;
  }

  set y(v: number) {
    this._y = v;
  }

  add(x: number, y: number): void {
    this.x += x;
    this.y += y;
  }

  constructor(private _x: number, private _y: number) {}
}

export default Vector2;
