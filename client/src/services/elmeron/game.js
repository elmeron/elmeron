import Chance from 'chance';
import Resource from './world/resource.js';
import ResourceDistribution from './world/resource-distribution.js';
import Deck from './world/deck.js';
import PlanetNode from './world/planet-node.js';
// import IslandNode from './world/island-node.js';

export default class Game {
  constructor(players) {
    this.id = new Chance().hash({ length: 6 });
    this.players = players;

    const distribution = new ResourceDistribution();
    const forest = new Resource('Forest');
    const rock = new Resource('Rock');
    const sand = new Resource('Sand');

    distribution.set(forest, 50);
    distribution.set(rock, 25);
    distribution.set(sand, 12);

    const deck = new Deck(distribution);
    this.world = new PlanetNode(deck);
  }
}
