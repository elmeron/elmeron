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
    this.emit('gameStart', {});
  }

  getWorld() {
    this.emit('getWorld', this.player.location.getData());
  }

  explore(position) {
    const explorationResult = this.player.location.explore(new Position(position.q, position.r));

    this.emit('explore', explorationResult);
  }

  zoomIn(childName) {
    const child = this.player.location.getChild(childName);

    if (child) {
      this.player.location = child;
      this.getWorld();
    }
  }

  zoomOut() {
    const parent = this.player.location.parent;

    if (parent) {
      this.player.location = parent;
      this.getWorld();
    }
  }
}

export default new Elmeron();
