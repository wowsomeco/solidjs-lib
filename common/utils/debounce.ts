import Timer from './timer';

class Debounce {
  private _timer: Timer;

  run(onDone: () => void, delay: number) {
    this.cancel();
    this._timer = new Timer(delay, onDone);
  }

  cancel() {
    this._timer?.stop();
  }
}

export default Debounce;
