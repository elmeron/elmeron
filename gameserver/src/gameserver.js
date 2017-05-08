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

    // pipe player events to the room specified by the player nickname
    game.players.forEach((player, nickname) => {
      const channel = server.of(game.id).to(nickname);

      pipeChannels([
        'getPlayer',
        'getWorld',
        'explore',
        'refineryBuilt',
        'refineryChange',
      ], player, channel);
    });

    server.of(game.id).on('connection', (socket) => {
      logger.info(`New socket connection to game (${game.id})`);

      // pipe socket events to the player object
      socket.on('joinGame', ({ nickname }, ack = () => {}) => {
        const player = game.getPlayer(nickname);

        if (player) {
          socket.join(nickname);

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
    });
  });

  /**
   * Non-game specific connections.
   */
  server.on('connection', (socket) => {
    logger.info(`New socket connection to main namespace (${socket.id})`);

    socket.on('startGame', ({ nickname }, ack = () => {}) => {
      if (nickname && nickname.length > 0) {
        logger.info(`${nickname} joins the lobby`);
        lobby.registerPlayer(nickname, socket);

        ack(null);
      } else {
        ack('Cannot start game: Not a valid nickname');
      }
    });
  });

  return server;
}
