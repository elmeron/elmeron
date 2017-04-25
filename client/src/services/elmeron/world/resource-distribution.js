import { Map } from 'immutable';
import Resource from './resource.js';

export default class ResourceDistribution {
  constructor(resources = []) {
    this.distribution = new Map();
    this.size = 0;

    resources.forEach(({ resource }) => {
      const res = new Resource(resource);
      const count = this.count(res);

      this.set(res, count + 1);
    });
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

  max() {
    return this.distribution.maxBy(val => val.get('amount')).get('resource');
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
