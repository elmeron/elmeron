import Chance from 'chance';

export default class Deck {
  constructor(distribution) {
    this.distribution = distribution;
    this.size = this.distribution.size;
    this.rand = new Chance();
  }

  pick() {
    const size = this.distribution.size;
    const randomIndex = this.rand.integer({ min: 0, max: size });
    const pickedResource = this.distribution.get(randomIndex);

    if (pickedResource) {
      const currentAmount = this.distribution.count(pickedResource);

      this.distribution.set(pickedResource, currentAmount - 1);
      this.size = this.distribution.size;
    }

    return pickedResource;
  }
}
