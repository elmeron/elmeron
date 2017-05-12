import createGameServer from './gameserver.js';
import logger from './logger.js';

const PORT = process.env.PORT || 3000;
const IDLE_TIME_BEFORE_START = 5000;
const MAX_PLAYERS = 10;

function onReady({ port }) {
  logger.info(`Gameserver listening on port ${port}`);
}

createGameServer(PORT, onReady, MAX_PLAYERS, IDLE_TIME_BEFORE_START);
