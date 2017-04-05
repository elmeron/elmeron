/**
 * Elmeron entry point.
 */

import EventEmitter from 'events';
import Player from './player.js';
import Game from './game.js';
import Position from './world/position.js';

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

  explore(position) {
    const explorationResult = this.game.world.explore(new Position(position.q, position.r));

    this.emit('explore', explorationResult);
  }
}

export default new Elmeron();
