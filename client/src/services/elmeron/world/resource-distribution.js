import { Map } from 'immutable';

export default class ResourceDistribution {
  constructor() {
    this.distribution = new Map();
    this.size = 0;
  }

  set(resource, amount) {
    const oldAmount = this.count(resource);

    if (amount >= 0) {
      const key = resource.name;
      const value = new Map({ resource, amount });
      this.distribution = this.distribution.set(key, value);
      this.size += amount - oldAmount;
    }
  }

  count(resource) {
    const r = this.distribution.getIn([resource.name, 'amount']);
    return r || 0;
  }

  get(index) {
    let i = 0;
    const resource = this.distribution.find((value) => {
      i += value.get('amount');
      return index < i;
    });

    return resource ? resource.get('resource') : undefined;
  }

  forEach(fn) {
    this.distribution.forEach(value => fn(value.get('resource'), value.get('amount')));
  }
}
