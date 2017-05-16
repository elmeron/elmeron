import Chance from 'chance';
import EventEmitter from 'events';
import { Map, List } from 'immutable';
import SpaceNode from './world/space-node.js';
import Market from './market.js';

export default class Game extends EventEmitter {
  constructor(players, onElmeronFound) {
    super();
    this.id = new Chance().hash({ length: 6 });
    this.elmeronFound = false;
    this.players = players.reduce((result, player) =>
      result.set(player.nickname, player),
    new Map());

    this.market = new Market(this.players);
    this.market.on('marketUpdate', data => this.emit('marketUpdate', data));

    this.world = new SpaceNode(onElmeronFound);
    this.world.on('elmeronFound', (data) => {
      this.elmeronFound = true;
      this.emit('elmeronFound', data, this.world);
    });

    const startingIsland = this.world.children.first().children.first();

    this.players.forEach(player => {
      player.setLocation(startingIsland);
      player.market = this.market;
    });
  }

  getPlayer(nickname) {
    return this.players.get(nickname);
  }

  getPlayersStatus() {
    return this.players.reduce((result, player) =>
      result.push(new Map({
        nickname: player.nickname,
        online: player.online,
        hasLeft: player.hasLeftGame,
      }))
    , new List()).toJS();
  }

  allPlayersHasLeft() {
    return this.players.every(player => player.hasLeftGame);
  }

  notifyPlayersStatus() {
    this.emit('playersStatusUpdate', this.getPlayersStatus());
  }
}
