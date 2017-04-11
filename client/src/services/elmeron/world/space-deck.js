import Deck from './deck.js';
import ResourceDistribution from './resource-distribution.js';
import Forest from './resources/forest.js';
import Rock from './resources/rock.js';
import ElmeronResource from './resources/elmeron.js';

export default class SpaceDeck extends Deck {
  constructor() {
    const distribution = new ResourceDistribution();

    distribution.set(new Forest(), 1);
    distribution.set(new Rock(), 1);
    distribution.set(new ElmeronResource(), 1);

    super(distribution);
  }
}
