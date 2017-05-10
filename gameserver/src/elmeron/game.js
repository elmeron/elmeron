import Chance from 'chance';
import EventEmitter from 'events';
import { Map } from 'immutable';
import SpaceNode from './world/space-node.js';

export default class Game extends EventEmitter {
  constructor(players, onElmeronFound) {
    super();
    this.id = new Chance().hash({ length: 6 });
    this.elmeronFound = false;
    this.players = players.reduce((result, player) =>
      result.set(player.nickname, player),
    new Map());

    this.world = new SpaceNode(onElmeronFound);
    this.world.on('elmeronFound', (data) => {
      this.elmeronFound = true;
      this.emit('elmeronFound', data, this.world);
    });

    const startingIsland = this.world.children.first().children.first();

    this.players.forEach(player => player.setLocation(startingIsland));
  }

  getPlayer(nickname) {
    return this.players.get(nickname);
  }

  allPlayersHasLeft() {
    return this.players.every(player => player.hasLeftGame);
  }
}
