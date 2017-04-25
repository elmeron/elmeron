import { fromJS } from 'immutable';
import Resource from './resource.js';
import DeltaAmount from './delta-amount.js';

export default class CountableResource extends Resource {
  constructor(name, now, timeUnit) {
    super(name);
    this.deltaAmount = new DeltaAmount(now, timeUnit);
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
}
