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

export default class Elmeron extends EventEmitter {
  constructor(url, ready) {
    super();
    this.url = url;
    this.client = io(this.url);
    this.client.once('connect', ready);
  }

  startGame(nickname) {
    this.client.once('gameReady', ({ id }) => {
      this.client = io(`${this.url}/${id}`);
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
    this.client.emit('startGame', { nickname }, (err) => {
      if (err) {
        throw new Error(err);
      }
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

