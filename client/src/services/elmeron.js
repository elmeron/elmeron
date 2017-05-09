/**
 * Elmeron entry point.
 */

import EventEmitter from 'events';
import io from 'socket.io-client';
import LocalStorage from './local-storage.js';

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

  hasGame(id, ack) {
    this.client.emit('hasGame', { id }, ack);
  }

  joinGame(gameId, nickname) {
    this.client.disconnect();
    this.client = io(`${this.url}/${gameId}`, ioOptions);
    this.initConnectionListeners();

    this.client.once('connect', () => {
      this.client.emit('joinGame', { nickname }, data =>
        this.emit('gameStart', data)
      );

      pipeChannels([
        'getPlayer',
        'getWorld',
        'explore',
        'refineryBuilt',
        'refineryChange',
      ], this.client, this);
    });
  }

  startGame(nickname, ack) {
    this.client.emit('startGame', { nickname }, (err) => {
      if (err) {
        return ack(err);
      }

      this.client.once('gameReady', ({ id }) => {
        LocalStorage.saveData(id, nickname);
        this.joinGame(id, nickname);
      });

      return ack();
    });
  }

  leaveGame(nickname, ack) {
    this.client.emit('leaveGame', { nickname }, (err) => {
      if (err) {
        throw new Error(err);
      }

      LocalStorage.deleteData();
      this.client.disconnect();
      this.client = io(this.url, ioOptions);
      this.initConnectionListeners();
      ack();
    });
  }

  getPlayer() {
    this.client.emit('getPlayer');
  }

  getWorld() {
    this.client.emit('getWorld');
  }

  explore(position) {
    this.client.emit('explore', { position });
  }

  zoomIn(childName) {
    this.client.emit('zoomIn', { childName });
  }

  zoomOut() {
    this.client.emit('zoomOut');
  }

  buildRefinery(positions) {
    this.client.emit('buildRefinery', ({ positions }));
  }

  pickGem(position) {
    this.client.emit('pickGem', ({ position }));
  }
}

