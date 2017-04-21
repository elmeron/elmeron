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

    this.world = new SpaceNode(onElmeronFound);

    const startingIsland = this.world.children.first().children.first();

    /* eslint-disable */
    this.players.forEach((player) => {
      player.location = startingIsland;
    });
    /* eslint-enable */
  }

  getPlayer(nickname) {
    return this.players.get(nickname);
  }
}
