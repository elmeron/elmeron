import Chance from 'chance';
import Deck from './deck.js';
import IslandResource from './island-resource.js';
import LogarithmicDistribution from './logarithmic-distribution.js';

const chance = new Chance();

export default class IslandDeck extends Deck {
  constructor(biase) {
    const now = Date.now();
    const timeUnit = 1000;
    const resources = [
      new IslandResource('Forest', now, timeUnit),
      new IslandResource('Rock', now, timeUnit),
      new IslandResource('Sand', now, timeUnit),
    ];
    const randomInt = chance.integer({ min: 5, max: 10 });
    const size = Math.exp(biase.size) * randomInt;
    const distribution = new LogarithmicDistribution(resources, biase, size);

    super(distribution);
  }
}
