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
    const randomInt = chance.integer({ min: 10, max: 20 });
    const size = (biase.size + 1) * randomInt;
    const distribution = new LogarithmicDistribution(resources, biase, size);

    console.log('Creating new island');
    console.log(distribution.distribution.toJS());

    super(distribution);
  }
}
