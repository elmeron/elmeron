import { Map } from 'immutable';
import ResourceDistribution from './world/resource-distribution.js';

export default class GemInventory {
  constructor() {
    this.distribution = new ResourceDistribution();
  }

  add(resource, amount) {
    const previousAmount = this.distribution.count(resource);

    this.distribution.set(resource, previousAmount + amount);
  }

  set(resource, amount) {
    this.distribution.set(resource, amount);
  }

  count(resource) {
    return this.distribution.count(resource);
  }

  getData() {
    return this.distribution.distribution.reduce((result, value) => {
      const resource = value.get('resource');
      const amount = value.get('amount');

      return result.set(resource.name, amount);
    }, new Map()).toJS();
  }
}
