import Chance from 'chance';
import Deck from './deck.js';
import ResourceDistribution from './resource-distribution.js';
import LogarithmicDistribution from './logarithmic-distribution.js';
import Forest from './resources/forest.js';
import Rock from './resources/rock.js';
import Sand from './resources/sand.js';
import ElmeronResource from './resources/elmeron.js';

const chance = new Chance();

function randomBiase() {
  return chance.integer({ min: 1, max: 100 });
}

export default class SpaceDeck extends Deck {
  constructor() {
    const resources = [
      new Forest(),
      new Rock(),
      new Sand(),
      new ElmeronResource(),
    ];
    const size = chance.integer({ min: 20, max: 40 });
    const biase = new ResourceDistribution();

    biase.set(new Forest(), randomBiase());
    biase.set(new Rock(), randomBiase());
    biase.set(new Sand(), randomBiase());

    const distribution = new LogarithmicDistribution(resources, biase, size);
    distribution.set(new ElmeronResource(), 1);

    super(distribution);
  }
}
