import createGameServer from './gameserver.js';
import logger from './logger.js';

const port = process.env.PORT || 3000;

createGameServer(port, ({ port: p }) => {
  logger.info(`Gameserver listening on port ${p}`);
});
