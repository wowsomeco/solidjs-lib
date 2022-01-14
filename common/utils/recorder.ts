type Data = number | string;

interface RecorderOptions {
  shouldUnique?: boolean;
}

class Recorder {
  private _data: Data[] = [];
  private _combos: Map<string, Data[]>[] = [];

  constructor(private _options: RecorderOptions) {}

  get concatData(): string {
    return this._data.reduce<string>((p, c) => p + c.toString(), '');
  }

  record(data: Data, cb?: (foundKey: string | undefined) => void): Recorder {
    let shouldAdd = true;

    // dont add to current data arr if shouldUnique and exists already
    if (this._options.shouldUnique && this._data.find((x) => x === data)) {
      shouldAdd = false;
    }

    if (shouldAdd) {
      this._data.push(data);
      cb?.(this._checkCombo());
    }

    cb?.(undefined);
    return this;
  }

  saveCombo(combo: Map<string, Data[]>): Recorder {
    this._combos.push(combo);
    return this;
  }

  clear(): void {
    this._data = [];
  }

  private _checkCombo(): string | undefined {
    for (let i = 0; i < this._combos.length; i++) {
      const c = this._combos[i];
      for (const [key, value] of c) {
        const concatCombo = value.reduce<string>(
          (p, c) => p + c.toString(),
          ''
        );

        if (concatCombo === this.concatData) {
          return key;
        }
      }
    }

    return undefined;
  }
}

export default Recorder;
