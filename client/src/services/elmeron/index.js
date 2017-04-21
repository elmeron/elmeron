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
    this.game = new Game([this.player], tile => this.emit('elmeronFound', tile));
    this.emit('gameStart', {
      player: this.player.getData(),
    });
  }

  getWorld() {
    this.emit('getWorld', this.player.location.getData());
  }

  explore(position) {
    const fuelCost = 10;
    const fuelAmount = this.player.getFuelAmount();

    if (fuelAmount >= fuelCost) {
      const explorationResult = this.player.location.explore(new Position(position.q, position.r));
      const previousDelta = this.player.fuel.delta;

      this.player.addFuelAmount(-fuelCost);
      this.player.setFuelDelta(previousDelta + 0.1);
      this.emit('getPlayer', this.player.getData());
      this.emit('explore', explorationResult);
    }
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
