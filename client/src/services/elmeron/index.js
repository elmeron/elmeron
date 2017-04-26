/**
 * Elmeron entry point.
 */

import EventEmitter from 'events';
import Player from './player.js';
import Game from './game.js';

class Elmeron extends EventEmitter {
  startGame(nickname) {
    this.player = new Player(nickname);
    this.game = new Game([this.player], tile => this.emit('elmeronFound', tile));
    this.emit('gameStart', {
      player: this.player.getData(),
    });

    this.player.on('explore', data => this.emit('explore', data));
    this.player.on('getPlayer', data => this.emit('getPlayer', data));
    this.player.on('getWorld', data => this.emit('getWorld', data));
    this.player.on('refineryBuilt', data => this.emit('refineryBuilt', data));
    this.player.on('refineryChange', data => this.emit('refineryChange', data));
  }

  getWorld() {
    this.emit('getWorld', this.player.location.getData());
  }

  explore(position) {
    this.player.explore(position);
  }

  zoomIn(childName) {
    this.player.zoomIn(childName);
  }

  zoomOut() {
    this.player.zoomOut();
  }

  buildRefinery(positions) {
    this.player.buildRefinery(positions);
  }
}

export default new Elmeron();
