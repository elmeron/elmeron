import assert from 'assert';
import Resource from '../resource.js';

export default class Fuel extends Resource {
  constructor(now, timeUnit) {
    super('Fuel');

    assert(timeUnit > 0, 'timeUnit must be > 0');

    this.timeUnit = timeUnit;
    this.delta = 0;
    this.deltaStart = now;
    this.offset = 0;
  }

  getAmount(now) {
    const time = Math.round((now - this.deltaStart) / this.timeUnit);

    return this.offset + (this.delta * time);
  }

  addAmount(amount) {
    this.offset += amount;
  }

  setDelta(delta, now) {
    this.offset = this.getAmount(now);
    this.deltaStart = now;
    this.delta = delta;
  }

  getData() {
    return {
      delta: this.delta,
      deltaStart: this.deltaStart,
      offset: this.offset,
    };
  }
}
