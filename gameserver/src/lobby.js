import EventEmitter from 'events';
import { Map, List } from 'immutable';
import Game from './elmeron/game.js';
import Player from './elmeron/player.js';

class DefaultLobbyPolicy extends EventEmitter {
  constructor(maxPlayers = 10, timeout = 5000) {
    super();
    this.timeout = timeout;
    this.maxPlayers = maxPlayers;
    this.timer = 0;
  }

  check(players) {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    if (players.size >= this.maxPlayers) {
      process.nextTick(() => this.emit('gameReady'));
    } else {
      this.timer = setTimeout(() => this.emit('gameReady'), this.timeout);
    }
  }
}

export default class Lobby extends EventEmitter {
  constructor(maxPlayers, timeout) {
    super();
    this.players = new Map();
    this.policy = new DefaultLobbyPolicy(maxPlayers, timeout);

    this.policy.on('gameReady', () => {
      const game = this.createGame();
      this.notifyPlayersGameReady(game.id);
      this.emit('gameReady', game);
      this.players = this.players.clear();
    });
  }

  registerPlayer(nickname, socket) {
    this.players = this.players.set(nickname, socket);
    this.policy.check(this.players);
  }

  hasPlayer(nickname) {
    return this.players.has(nickname);
  }

  createGame() {
    const players = this.players.reduce((result, socket, nickname) =>
      result.push(new Player(nickname))
    , new List());

    return new Game(players);
  }

  notifyPlayersGameReady(id) {
    this.players.forEach(socket =>
      socket.emit('gameReady', { id })
    );
  }
}
