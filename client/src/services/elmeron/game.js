import Chance from 'chance';
import Resource from './world/resource.js';
import ResourceDistribution from './world/resource-distribution.js';
import Deck from './world/deck.js';
import IslandNode from './world/island-node.js';

export default class Game {
  constructor(players) {
    this.id = new Chance().hash({ length: 6 });
    this.players = players;

    const distribution = new ResourceDistribution();
    const resource = new Resource('Forest');

    distribution.set(resource, 10);

    const deck = new Deck(distribution);

    this.world = new IslandNode(deck);
  }
}
