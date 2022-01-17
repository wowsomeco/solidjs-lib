class Vector2 {
  static zero(): Vector2 {
    return new Vector2(0, 0);
  }

  static create(x: number, y: number): Vector2 {
    return new Vector2(x, y);
  }

  static add(v1: Vector2, v2: Vector2): Vector2 {
    return new Vector2(v1.x + v2.x, v1.y + v2.y);
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

  add(x: number, y: number): Vector2 {
    this.x += x;
    this.y += y;

    return this;
  }

  constructor(private _x: number, private _y: number) {}
}

export default Vector2;
