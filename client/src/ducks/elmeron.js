import { fromJS } from 'immutable';
import { act, reducer } from './util.js';
import Elmeron from '../services/elmeron.js';
import LocalStorage from '../services/local-storage.js';
import time from '../services/time.js';
import * as card from './card.js';
import * as grid from './grid.js';
import * as player from './player.js';
import * as ui from './ui.js';
import * as world from './world.js';
import * as refinery from './refinery.js';
import * as market from './market.js';

const url = process.env.GAMESERVER_URL || 'http://localhost:3000';
let elmeron;

const SET_NICKNAME = 'elmeron/SET_NICKNAME';
const SET_CONNECTED = 'elmeron/SET_CONNECTED';
const SET_CONNECTING = 'elmeron/SET_CONNECTING';
const SET_ERROR = 'elmeron/SET_ERROR';
const SET_PLAYERS = 'elmeron/SET_PLAYERS';

const initialState = {
  nickname: undefined,
  connected: false,
  connecting: true,
  error: undefined,
  players: [],
};

export function setNickname(nickname) {
  return act(SET_NICKNAME, nickname);
}

export function initListeners() {
  return (dispatch, getState) => {
    elmeron = new Elmeron(url);

    elmeron.once('connect', () => {
      const { gameId, nickname } = LocalStorage.getData();

      if (gameId && nickname) {
        elmeron.hasGame(gameId).then((val) => {
          if (val) {
            elmeron.joinGame(gameId, nickname);
            dispatch(setNickname(nickname));
          } else {
            LocalStorage.deleteData();
          }
        });
      }
    });

    elmeron.on('connect', () => dispatch(act(SET_CONNECTED, true)));
    elmeron.on('disconnect', () => dispatch(act(SET_CONNECTED, false)));
    elmeron.on('connecting', () => dispatch(act(SET_CONNECTING, true)));
    elmeron.on('connect_timeout', () => dispatch(act(SET_CONNECTING, false)));
    elmeron.on('error', error => dispatch(act(SET_ERROR, error)));

    elmeron.on('getWorld', (data) => {
      dispatch(world.setCurrentLocation(data.name));
      dispatch(world.setParentLocation(data.parent));
      dispatch(world.setChildrenLocations(data.children));
      dispatch(world.setNodeType(data.nodeType));
      dispatch(world.setExplorationCost(data.explorationCost));
      dispatch(world.setTiles(data.tiles));
      dispatch(grid.setExtremes(data.tiles));
      dispatch(world.setIsExplored(data.isExplored));
      dispatch(world.setNextGemGeneration(data.nextGeneration));

      dispatch(card.closeCard());
    });

    elmeron.on('getPlayer', ({ fuel, gems, hasExploredFirstIsland }) => {
      dispatch(player.setFuelData(fuel));
      dispatch(player.setGemData(gems));
      dispatch(player.setHasExploredFirstIsland(hasExploredFirstIsland));
    });

    elmeron.on('gameStart', ({
      player: playerData,
      world: worldData,
      elmeronFound,
      market: marketData,
      players,
      timestamp,
    }) => {
      elmeron.emit('getWorld', worldData);
      elmeron.emit('getPlayer', playerData);

      dispatch(market.updateMarket(marketData));
      dispatch(act(SET_PLAYERS, players));

      time.setOffset(timestamp - time.now());

      dispatch(card.closeCard());

      if (elmeronFound) {
        const elmeronTile = getState().world.get('tiles').find(tile =>
          tile.getIn(['resource', 'name']) === 'Elmeron'
        );

        elmeron.emit('elmeronFound', elmeronTile.toJS());
      } else {
        dispatch(ui.showLobbyCountdownView());
      }
    });

    elmeron.on('elmeronFound', ({ q, r }) => {
      elmeron.getWorld().then((data) => {
        elmeron.emit('getWorld', data);
        dispatch(grid.focus({ q, r }));
        dispatch(ui.showGameOverView());
      });
    });

    elmeron.on('explore', ({ tiles, worlds, isExplored }) => {
      const hasExploredFirstIsland = getState().player.get('hasExploredFirstIsland');

      if (!hasExploredFirstIsland && isExplored) {
        dispatch(player.setHasExploredFirstIsland());
      }

      dispatch(world.mergeTiles(tiles));
      dispatch(grid.updateExtremes(tiles));
      dispatch(world.setIsExplored(isExplored));

      if (worlds && worlds.length > 0) {
        dispatch(world.addChildrenLocations(worlds));
      }
    });

    elmeron.on('refineryBuilt', ({ tiles, fuel, gems }) => {
      dispatch(world.mergeTiles(tiles));
      dispatch(player.setFuelData(fuel));
      dispatch(player.setGemData(gems));
      dispatch(refinery.stopMonitoring());
      dispatch(card.closeCard());
    });

    elmeron.on('refineryChange', ({ tiles, fuel }) => {
      if (tiles) {
        dispatch(world.mergeTiles(tiles));
      }
      if (fuel) {
        dispatch(player.setFuelData(fuel));
      }
    });

    elmeron.on('marketUpdate', (gems) => {
      dispatch(market.updateMarket(gems));
    });

    elmeron.on('playersStatusUpdate', (players) => {
      dispatch(act(SET_PLAYERS, players));
    });

    elmeron.on('generateGems', (data) => {
      dispatch(world.setNextGemGeneration(data));
    });
  };
}

export function startGame(nickname) {
  return () => elmeron.startGame(nickname);
}

export function leaveGame() {
  return dispatch =>
    elmeron.leaveGame().then(() =>
      dispatch(player.resetData())
    );
}

export function zoomIn({ owner, q, r }) {
  elmeron.zoomIn(owner);
  return grid.zoomIn({ q, r });
}

export function zoomOut() {
  return (dispatch, getState) => {
    const parent = getState().world.getIn(['location', 'parent']);

    if (parent) {
      elmeron.zoomOut();
      dispatch(grid.zoomOut());
    } else {
      dispatch(act());
    }
  };
}

export function explore(tile) {
  elmeron.explore(tile);
  return act();
}

export function buildRefinery(positions) {
  elmeron.buildRefinery(positions);
  return act();
}

export function pickGem(position) {
  elmeron.pickGem(position);
  return act();
}

function handleSetNickname(state, nickname) {
  return state.set('nickname', nickname);
}

function handleSetConnected(state, value) {
  return state
    .set('connected', value)
    .set('connecting', false)
    .set('error', undefined);
}

function handleSetConnecting(state, value) {
  let connectedState = state;

  // only set connected to false if connecting will be set to true
  if (value) {
    connectedState = state.set('connected', false);
  }

  return connectedState.set('connecting', value);
}

function handleSetError(state, value) {
  return state.set('error', value);
}

function handleSetPlayers(state, players) {
  return state.set('players', fromJS(players));
}

const handlers = {
  [SET_NICKNAME]: handleSetNickname,
  [SET_CONNECTED]: handleSetConnected,
  [SET_CONNECTING]: handleSetConnecting,
  [SET_ERROR]: handleSetError,
  [SET_PLAYERS]: handleSetPlayers,
};

export default reducer(initialState, handlers);
