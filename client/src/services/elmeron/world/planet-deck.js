import Deck from './deck.js';
import ResourceDistribution from './resource-distribution.js';
import Forest from './resources/forest.js';
import Rock from './resources/rock.js';

export default class PlanetDeck extends Deck {
  constructor() {
    const distribution = new ResourceDistribution();

    distribution.set(new Forest(), 10);
    distribution.set(new Rock(), 5);

    super(distribution);
  }
}
