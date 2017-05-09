/**
 * Elmeron entry point.
 */

import EventEmitter from 'events';
import io from 'socket.io-client';

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

  startGame(nickname, ack) {
    this.client.emit('startGame', { nickname }, (err) => {
      if (err) {
        return ack(err);
      }

      this.client.once('gameReady', ({ id }) => {
        this.client.disconnect();
        this.client = io(`${this.url}/${id}`, ioOptions);
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
      });

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

