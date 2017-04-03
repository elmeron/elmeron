/**
 * Elmeron entry point.
 */

import EventEmitter from 'events';
import Player from './player.js';
import Game from './game.js';

export default class Elmeron extends EventEmitter {
  startGame(nickname) {
    this.player = new Player(nickname);
    this.game = new Game([this.player]);
    this.emit('gameStart', {
      id: this.game.id,
      player: this.player,
    });
  }
}
