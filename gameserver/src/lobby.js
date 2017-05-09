import EventEmitter from 'events';
import { Map, List } from 'immutable';
import Game from './elmeron/game.js';
import Player from './elmeron/player.js';

export default class Lobby extends EventEmitter {
  constructor(lobbyPolicy) {
    super();
    this.players = new Map();
    this.policy = lobbyPolicy || Lobby.defaultPolicy;
  }

  registerPlayer(nickname, socket) {
    this.players = this.players.set(nickname, socket);
    this.policy(this.players, () => {
      const game = this.createGame();

      this.notifyPlayersGameReady(game.id);
      this.emit('gameReady', game);
      this.players = this.players.clear();
    });
  }

  hasPlayer(nickname) {
    return this.players.has(nickname);
  }

  static defaultPolicy(players, ready) {
    return ready();
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
