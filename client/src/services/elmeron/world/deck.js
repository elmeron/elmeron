import Chance from 'chance';
import ResourceDistribution from './resource-distribution.js';

export default class Deck {
  constructor(distribution) {
    this.distribution = distribution;
    this.size = this.distribution.size;
    this.rand = new Chance();
  }

  pick() {
    const size = this.distribution.size;

    if (size > 0) {
      const randomIndex = this.rand.integer({ min: 0, max: size - 1 });
      return this.distribution.get(randomIndex);
    }

    return undefined;
  }

  // removes one resource
  remove(resource) {
    const amount = this.distribution.count(resource);

    if (amount > 0) {
      this.distribution.set(resource, amount - 1);
      this.size = this.distribution.size;
    }
  }

  isEmpty() {
    return this.size === 0;
  }

  redistribute(distribution) {
    const redistribution = new ResourceDistribution();

    this.distribution.forEach((resource, amount) => {
      const otherAmount = distribution.count(resource);

      if (otherAmount === 0) {
        redistribution.set(resource, amount);
      } else {
        const neighbourQuota = otherAmount / distribution.size;
        const newAmount = amount * (1 + (otherAmount * otherAmount * neighbourQuota));

        redistribution.set(resource, Math.round(newAmount));
      }
    });

    return new Deck(redistribution);
  }
}
