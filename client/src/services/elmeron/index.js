/**
 * Elmeron entry point.
 */

import EventEmitter from 'events';
import Player from './player.js';
import Game from './game.js';

class Elmeron extends EventEmitter {
  startGame(nickname) {
    this.player = new Player(nickname);
    this.game = new Game([this.player]);
    this.emit('gameStart', {
      id: this.game.id,
    });
  }

  getTiles() {
    this.emit('getTiles', this.game.world.grid.getTiles());
  }
}

export default new Elmeron();
