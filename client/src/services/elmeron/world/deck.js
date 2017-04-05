import Chance from 'chance';

export default class Deck {
  constructor(distribution) {
    this.distribution = distribution;
    this.size = this.distribution.size;
    this.rand = new Chance();
  }

  pick() {
    const size = this.distribution.size;
    const randomIndex = this.rand.integer({ min: 0, max: size - 1 });
    return this.distribution.get(randomIndex);
  }

  pickAndRemove() {
    const pickedResource = this.pick();
    const amount = this.distribution.count(pickedResource);
    this.distribution.set(pickedResource, amount - 1);
    this.size = this.distribution.size;
    return pickedResource;
  }

  isEmpty() {
    return this.size === 0;
  }
}
