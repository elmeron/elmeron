import Chance from 'chance';
import Deck from './deck.js';
import CountableResource from './countable-resource.js';
import LogarithmicDistribution from './logarithmic-distribution.js';

const chance = new Chance();

export default class IslandDeck extends Deck {
  constructor(biase) {
    const now = Date.now();
    const timeUnit = 1000;
    const resources = [
      new CountableResource('Forest', now, timeUnit),
      new CountableResource('Rock', now, timeUnit),
      new CountableResource('Sand', now, timeUnit),
    ];
    const randomInt = chance.integer({ min: 5, max: 10 });
    const size = Math.exp(biase.size) * randomInt;
    const distribution = new LogarithmicDistribution(resources, biase, size);

    super(distribution);
  }
}
