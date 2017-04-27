import Chance from 'chance';
import { fromJS } from 'immutable';
import Resource from './resource.js';
import DeltaAmount from './delta-amount.js';

const chance = new Chance();

export default class CountableResource extends Resource {
  constructor(name, now, timeUnit) {
    super(name);
    this.deltaAmount = new DeltaAmount(now, timeUnit);
  }

  generateStartAmount() {
    this.deltaAmount.offset = chance.integer({ min: 10, max: 100 });
  }

  getAmount(now) {
    return this.deltaAmount.getAmount(now);
  }

  addAmount(amount) {
    this.deltaAmount.addAmount(amount);
  }

  setDelta(delta, now) {
    this.deltaAmount.setDelta(delta, now);
  }

  getData() {
    const resourceData = fromJS(super.getData());
    const deltaAmountData = fromJS(this.deltaAmount.getData());

    return resourceData.merge(deltaAmountData).toJS();
  }

  clone() {
    const copy = new CountableResource(this.name, 0, 1);

    copy.deltaAmount = this.deltaAmount.clone();

    return copy;
  }
}
