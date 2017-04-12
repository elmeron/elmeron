import Chance from 'chance';
import { fromJS, Range as range } from 'immutable';
import ResourceDistribution from './resource-distribution.js';

const chance = new Chance();

export default class LogarithmicDistribution extends ResourceDistribution {
  constructor(resources, biase, size) {
    super();

    // assign each resource a random number between 0 and 1
    const value = chance.floating({ min: 0, max: 0.9, fixed: 7 });
    const randomAssignment = resources.map(resource => ({ resource, value }));

    // sort the resources first after biase, secondly after the previous random
    // assignment
    const sortedResources = fromJS(resources).sortBy((resource) => {
      const biaseCount = biase.count(resource);

      if (biaseCount === 0) {
        const randomVal = randomAssignment.find(val => val.resource.equals(resource)).value;

        return randomVal;
      }

      return biaseCount;
    }, (a, b) => a < b);

    let remainingSize = size;

    // in order, set the distribution and half the amount every time
    sortedResources.forEach((resource, index) => {
      const length = resources.length;

      if (index < length - 1) {
        remainingSize /= 2;
      }

      this.set(resource, Math.round(remainingSize));
    });
  }
}
