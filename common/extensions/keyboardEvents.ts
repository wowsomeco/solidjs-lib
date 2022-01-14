export function isControlPressed(ev: KeyboardEvent): boolean {
  return ev.ctrlKey || ev.metaKey;
}

export function isKeyPressed(ev: KeyboardEvent, ...keys: string[]) {
  return keys?.includes(ev.key);
}

export function keyUndo(ev: KeyboardEvent): boolean {
  return isControlPressed(ev) && isKeyPressed(ev, 'z', 'Z');
}

export function keyCopy(ev: KeyboardEvent): boolean {
  return isControlPressed(ev) && isKeyPressed(ev, 'c', 'C');
}

export function keyCut(ev: KeyboardEvent): boolean {
  return isControlPressed(ev) && isKeyPressed(ev, 'x', 'X');
}

export function keyPaste(ev: KeyboardEvent): boolean {
  return isControlPressed(ev) && isKeyPressed(ev, 'v', 'V');
}
