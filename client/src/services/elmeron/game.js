import Chance from 'chance';
import { Map } from 'immutable';
import Resource from './world/resource.js';
import ResourceDistribution from './world/resource-distribution.js';
import Deck from './world/deck.js';
import SpaceNode from './world/space-node.js';

export default class Game {
  constructor(players, onElmeronFound) {
    this.id = new Chance().hash({ length: 6 });
    this.players = players.reduce((result, player) =>
      result.set(player.nickname, player),
    new Map());

    const distribution = new ResourceDistribution();
    const forest = new Resource('Forest');
    const rock = new Resource('Rock');
    const sand = new Resource('Sand');

    distribution.set(forest, 50);
    distribution.set(rock, 25);
    distribution.set(sand, 12);

    const deck = new Deck(distribution);
    this.world = new SpaceNode(deck, onElmeronFound);

    /* eslint-disable */
    this.players.forEach((player) => {
      player.location = this.world;
    });
    /* eslint-enable */
  }

  getPlayer(nickname) {
    return this.players.get(nickname);
  }
}
