import createGameServer from './gameserver.js';
import logger from './logger.js';

const PORT = process.env.PORT || 3000;
const IDLE_TIME_BEFORE_START = 5000;
const MAX_PLAYERS = 2;

let timer = 0;

function lobbyPolicy(players, ready) {
  if (timer) {
    clearInterval(timer);
  }

  if (players.size === MAX_PLAYERS) {
    return ready();
  }

  timer = setTimeout(ready, IDLE_TIME_BEFORE_START);
}

const policy = process.env.NODE_ENV === 'development' ?
  undefined : lobbyPolicy;

createGameServer(PORT, ({ port }) => {
  logger.info(`Gameserver listening on port ${port}`);
}, lobbyPolicy);
