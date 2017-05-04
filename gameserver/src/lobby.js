import EventEmitter from 'events';
import Game from './elmeron/game.js';

export default class Lobby extends EventEmitter {
  constructor() {
    super();
    this.players = [];
  }

  addPlayer(player) {
    this.players.push(player);

    if (this.readyToPlay()) {
      this.emit('gameReady', {});
    }
  }

  readyToPlay() {
    return true;
  }
}
