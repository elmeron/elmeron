import { fromJS, Map } from 'immutable';
import Server from './server.js';
import Lobby from './lobby.js';
import Player from './elmeron/player.js';
import logger from './logger.js';
import requestResponseSkeleton from './skeleton';

function pipeChannels(events, from, to) {
  events.forEach(event =>
    from.on(event, data => to.emit(event, data))
  );
}

function wrapException(...args) {
  const handler = args[0];
  const handlerArgs = args.slice(1, args.length);
  try {
    return handler(...handlerArgs);
  } catch (err) {
    return {
      type: err.name,
      message: err.message,
    };
  }
}

class GameAPI {
  constructor(game, namespace) {
    this.game = game;
    this.namespace = namespace;
    this.socketMap = new Map();
  }

  getPlayerBySocket(socket) {
    const player = this.game.getPlayer(this.socketMap.get(socket.id));

    if (player) {
      return player;
    }

    throw new Error(`No player corresponding to socket '${socket.id}'`);
  }

  kickOutSocket(nickname) {
    const id = this.socketMap.findKey(name => name === nickname);

    if (id) {
      const socket = this.namespace.connected[id];
      logger.info(`Kicking out socket (${id})`);
      socket.disconnect();
    }
  }

  joinGame(nickname, socket) {
    const player = this.game.getPlayer(nickname);

    if (player) {
      logger.info(`${nickname} joined game (${this.game.id})`);

      this.kickOutSocket(nickname);
      this.socketMap = this.socketMap.set(socket.id, nickname);

      socket.on('disconnect', (reason) => {
        logger.info(`${nickname} disconnected (${reason})`);
        this.socketMap = this.socketMap.delete(socket.id);
      });

      pipeChannels([
        'getPlayer',
        'getWorld',
        'explore',
        'refineryBuilt',
        'refineryChange',
      ], player, socket);

      return { player: player.getData(), world: player.location.getData() };
    }

    throw new Error(`Cannot join game: No such player '${nickname}'`);
  }

  leaveGame(socket, server) {
    const player = this.getPlayerBySocket(socket);

    logger.info(`${player.nickname} left game (${this.game.id})`);

    player.hasLeftGame = true;
    player.removeAllListeners();

    if (this.game.allPlayersHasLeft()) {
      const connectedSockets = fromJS(this.namespace.connected);

      logger.info(`All players has left game ${(this.game.id)}: deconstructing it`);
      connectedSockets.forEach(sock => sock.disconnect());
      this.namespace.removeAllListeners();
      delete server.socketServer.nsps[`/${this.game.id}`];
    }
  }

  getPlayer(socket) {
    return this.getPlayerBySocket(socket).getData();
  }

  getWorld(socket) {
    return this.getPlayerBySocket(socket).location.getData();
  }

  explore(position, socket) {
    this.getPlayerBySocket(socket).explore(position);
  }

  zoomIn(childName, socket) {
    this.getPlayerBySocket(socket).zoomIn(childName);
  }

  zoomOut(socket) {
    this.getPlayerBySocket(socket).zoomOut();
  }

  buildRefinery(positions, socket) {
    this.getPlayerBySocket(socket).buildRefinery(positions);
  }

  pickGem(position, socket) {
    this.getPlayerBySocket(socket).pickGem(position);
  }
}

class MainAPI {
  constructor(server, lobbyPolicy) {
    this.server = server;
    this.lobby = new Lobby(lobbyPolicy);

    this.lobby.on('gameReady', (game) => {
      const gameApi = new GameAPI(game, this.server.of(game.id));

      logger.info(`Game (${game.id}) ready to play`);

      this.server.of(game.id).on('connection', (socket) => {
        logger.info(`(${socket.id}) connected to game (${game.id})`);

        socket.use((packet, next) => {
          try {
            requestResponseSkeleton(gameApi, packet, socket, this.server);
          } catch (e) {
            logger.error(`${e.name}: ${e.message}`);
            next(e);
          }
        });
      });
    });
  }

  startGame(nickname, socket) {
    if (this.lobby.hasPlayer(nickname)) {
      throw new Error(`Cannot join lobby: nickname '${nickname}' is already in use`);
    }

    if (nickname && nickname.length > 0) {
      logger.info(`${nickname} joins the lobby`);
      this.lobby.registerPlayer(nickname, socket);
    } else {
      throw new Error('Cannot start game: Not a valid nickname');
    }
  }

  hasGame(id, socket, server) {
    const games = fromJS(Object.keys(server.socketServer.nsps));
    return games.some(game => game === `/${id}`);
  }
}


export default function createGameServer(port, ready, lobbyPolicy) {
  const server = new Server(port);
  const lobby = new Lobby(lobbyPolicy);
  const mainApi = new MainAPI(server, lobbyPolicy);

  server.once('listening', ready);

  /**
   * Game specific connections.
   */
  lobby.on('gameReady', (game) => {
    logger.info(`Game ${game.id} ready to play`);

    server.of(game.id).on('connection', (socket) => {
      logger.info(`(${socket.id}) connected to game (${game.id})`);

      socket.on('disconnect', (reason) => {
        logger.info(`(${socket.id}) disconnected from game (${game.id}): ${reason}`);
      });

      // pipe socket events to the player object
      socket.on('joinGame', ({ nickname }, ack = () => {}) => {
        const player = game.getPlayer(nickname);

        if (player) {
          logger.info(`${nickname} joined game (${game.id})`);

          pipeChannels([
            'getPlayer',
            'getWorld',
            'explore',
            'refineryBuilt',
            'refineryChange',
          ], player, socket);

          socket.on('getPlayer', () => player.emit('getPlayer', wrapException(player.getData)));
          socket.on('getWorld', () => player.emit('getWorld', player.location.getData()));
          socket.on('explore', ({ position }) => player.explore(position));
          socket.on('zoomIn', ({ childName }) => player.zoomIn(childName));
          socket.on('zoomOut', () => player.zoomOut());
          socket.on('buildRefinery', ({ positions }) => player.buildRefinery(positions));
          socket.on('pickGem', ({ position }) => player.pickGem(position));

          ack({ player: player.getData(), world: player.location.getData() });
        } else {
          ack(false);
        }
      });

      socket.on('leaveGame', ({ nickname }, ack = () => {}) => {
        const player = game.getPlayer(nickname);

        if (player) {
          logger.info(`${nickname} left game (${game.id})`);

          player.hasLeftGame = true;
          player.removeAllListeners();
          ack(null);

          if (game.allPlayersHasLeft()) {
            const namespace = server.of(game.id);

            logger.info(`All players has left game ${(game.id)}: deconstructing it`);
            fromJS(namespace.connected).forEach(sock => sock.disconnect());
            namespace.removeAllListeners();
          }
        } else {
          ack('Cannot leave game: No such player');
        }
      });
    });
  });

  /**
   * Non-game specific connections.
   */
  server.on('connection', (socket) => {
    logger.info(`New socket connection to main namespace (${socket.id})`);

    socket.use((packet, next) => {
      try {
        requestResponseSkeleton(mainApi, packet, socket, server);
      } catch (e) {
        logger.error(`${e.name}: ${e.message}`);
        next(e);
      }
    });
  });

  return server;
}
