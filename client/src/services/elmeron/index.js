/**
 * Elmeron entry point.
 */

import EventEmitter from 'events';
import Player from './player.js';
import Game from './game.js';
import Position from './world/position.js';
import Refinery from './world/refinery.js';

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
    const explorationCost = this.player.location.explorationCost;
    const fuelAmount = this.player.getFuelAmount();

    if (fuelAmount >= explorationCost) {
      const explorationResult = this.player.location.explore(new Position(position.q, position.r));

      this.player.addFuelAmount(-explorationCost);
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

  buildRefinery(positions) {
    const price = Refinery.getPrice(positions);
    const fuelAmount = this.player.getFuelAmount();

    if (fuelAmount >= price) {
      const { tiles, delta } = this.player.location.buildRefinery(
        positions,
        (deltaChange, grid) => {
          this.player.addFuelDelta(deltaChange);
          const { fuel } = this.player.getData();
          this.emit('refineryChange', { tiles: grid.getTiles(), fuel });
        }
      );

      this.player.addFuelAmount(-price);
      this.player.addFuelDelta(delta);

      const { fuel } = this.player.getData();

      this.emit('refineryBuilt', { tiles, fuel });
    }
  }
}

export default new Elmeron();
