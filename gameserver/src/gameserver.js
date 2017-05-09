import { fromJS } from 'immutable';
import Server from './server.js';
import Lobby from './lobby.js';
import Player from './elmeron/player.js';
import logger from './logger.js';

function pipeChannels(events, from, to) {
  events.forEach(event =>
    from.on(event, data => to.emit(event, data))
  );
}

export default function createGameServer(port, ready, lobbyPolicy) {
  const server = new Server(port);
  const lobby = new Lobby(lobbyPolicy);

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

          socket.on('getPlayer', () => player.emit('getPlayer', player.getData()));
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

    socket.on('startGame', ({ nickname }, ack = () => {}) => {
      if (lobby.hasPlayer(nickname)) {
        ack('Nickname is already in use');
      } else if (nickname && nickname.length > 0) {
        logger.info(`${nickname} joins the lobby`);
        ack(null);
        lobby.registerPlayer(nickname, socket);
      } else {
        ack('Cannot start game: Not a valid nickname');
      }
    });

    socket.on('hasGame', ({ id }, ack) => {
      const games = fromJS(Object.keys(server.socketServer.nsps));
      const hasGame = games.some(game => game === `/${id}`);
      ack(hasGame);
    });
  });

  return server;
}
