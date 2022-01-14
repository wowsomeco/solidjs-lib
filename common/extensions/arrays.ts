export function lastIdx<T>(arr: T[]): T | undefined {
  return arr?.length > 0 ? arr[arr.length - 1] : undefined;
}

export function createNumArray(count: number, startIdx: number = 0): number[] {
  const arr = [];

  for (let i = startIdx; i < startIdx + count; i++) {
    arr.push(i);
  }

  return arr;
}

/** [[loop]] function callback */
export interface LoopCallback<T> {
  item: T;
  idx: number;
  first: boolean;
  last: boolean;
  prev: T | undefined;
}

/** iterates over the array with a custom callback [[LoopCalback]] for each of them  */
export function loop<T>(arr: T[], callback: (d: LoopCallback<T>) => void) {
  if (!arr) return;

  for (let idx = 0; idx < arr.length; idx++) {
    const item = arr[idx];
    const prev = idx > 0 ? arr[idx - 1] : undefined;
    const first = idx === 0;
    const last = idx === arr.length - 1;
    callback({ item, idx, first, last, prev });
  }
}
