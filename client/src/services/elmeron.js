/**
 * Elmeron entry point.
 */

import EventEmitter from 'events';
import io from 'socket.io-client';
import LocalStorage from './local-storage.js';
import RMI from './rmi.js';

function pipeChannels(events, from, to) {
  events.forEach(event =>
    from.on(event, data => to.emit(event, data))
  );
}

const ioOptions = {
  reconnectionAttempts: 10,
  timeout: 5000,
};

export default class Elmeron extends EventEmitter {
  constructor(url) {
    super();
    this.url = url;
    this.client = io(this.url, ioOptions);
    this.initConnectionListeners();
    this.rmi = RMI(this.client);
  }

  initConnectionListeners() {
    this.client.on('connect', () => this.emit('connect'));
    this.client.on('error', error => this.emit('error', error));
    this.client.on('connect_error', error => this.emit('error', error));
    this.client.on('reconnect_error', error => this.emit('error', error));
    this.client.on('connect_timeout', () => this.emit('connect_timeout'));
    this.client.on('reconnect_failed', () => this.emit('connect_timeout'));
    this.client.on('disconnect', () => this.emit('disconnect'));
    this.client.on('reconnect', () => this.emit('connect'));
    this.client.on('reconnecting', () => this.emit('connecting'));
  }

  hasGame(id) {
    return this.rmi.hasGame(id);
  }

  joinGame(gameId, nickname) {
    this.client.disconnect();
    this.client = io(`${this.url}/${gameId}`, ioOptions);
    this.rmi = RMI(this.client);
    this.initConnectionListeners();

    return this.rmi.once('connect')
      .then(() => {
        pipeChannels([
          'getPlayer',
          'getWorld',
          'explore',
          'refineryBuilt',
          'refineryChange',
          'elmeronFound',
          'marketUpdate',
          'playersStatusUpdate',
        ], this.client, this);

        return this.rmi.joinGame(nickname)
          .then(data =>
            this.emit('gameStart', data)
          );
      });
  }

  startGame(nickname) {
    return this.rmi.startGame(nickname)
      .then(() => this.rmi.once('gameReady'))
      .then(({ id }) => {
        LocalStorage.saveData(id, nickname);
        return this.joinGame(id, nickname);
      });
  }

  leaveGame() {
    this.rmi.leaveGame();

    LocalStorage.deleteData();
    this.client.disconnect();
    this.client = io(this.url, ioOptions);
    this.rmi = RMI(this.client);
    this.initConnectionListeners();

    return this.rmi.once('connect');
  }

  getPlayer() {
    return this.rmi.getPlayer();
  }

  getWorld() {
    return this.rmi.getWorld();
  }

  explore(position) {
    this.rmi.explore(position);
  }

  zoomIn(childName) {
    this.rmi.zoomIn(childName);
  }

  zoomOut() {
    this.rmi.zoomOut();
  }

  buildRefinery(positions) {
    this.rmi.buildRefinery(positions);
  }

  pickGem(position) {
    this.rmi.pickGem(position);
  }
}

