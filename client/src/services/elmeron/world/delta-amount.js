import assert from 'assert';

export default class DeltaAmount {
  constructor(now, timeUnit) {
    assert(timeUnit > 0, 'timeUnit must be > 0');

    this.timeUnit = timeUnit;
    this.delta = 0;
    this.deltaStart = now;
    this.offset = 0;
  }

  zerofy() {
    this.delta = 0;
    this.deltaStart = 0;
    this.offset = 0;
  }

  getAmount(now) {
    const time = Math.round((now - this.deltaStart) / this.timeUnit);

    return Math.round(this.offset + (this.delta * time));
  }

  addAmount(amount) {
    const newOffset = this.offset + amount;
    this.offset = Math.max(newOffset, 0);
  }

  setDelta(delta, now) {
    this.offset = this.getAmount(now);
    this.deltaStart = now;
    const newDelta = parseFloat(delta.toFixed(1));

    if (this.offset <= 0) {
      this.delta = Math.max(newDelta, 0);
    } else {
      this.delta = newDelta;
    }
  }

  getTimeTo(offsetValue, now = Date.now()) {
    if (this.delta === 0) {
      return Number.POSITIVE_INFINITY;
    }

    const currentAmount = this.getAmount(now);

    return (offsetValue - currentAmount) / this.delta;
  }

  getData() {
    return {
      delta: this.delta,
      deltaStart: this.deltaStart,
      offset: this.offset,
    };
  }

  clone() {
    const copy = new DeltaAmount(0, this.timeUnit);

    copy.delta = this.delta;
    copy.deltaStart = this.deltaStart;
    copy.offset = this.offset;

    return copy;
  }
}
