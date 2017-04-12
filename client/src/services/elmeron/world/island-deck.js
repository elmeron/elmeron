import Chance from 'chance';
import Deck from './deck.js';
import Forest from './resources/forest.js';
import Rock from './resources/rock.js';
import Sand from './resources/sand.js';
import LogarithmicDistribution from './logarithmic-distribution.js';

const chance = new Chance();

export default class IslandDeck extends Deck {
  constructor(biase) {
    const resources = [
      new Forest(),
      new Rock(),
      new Sand(),
    ];
    const randomInt = chance.integer({ min: 5, max: 10 });
    const size = Math.exp(biase.size) * randomInt;
    const distribution = new LogarithmicDistribution(resources, biase, size);

    super(distribution);
  }
}
