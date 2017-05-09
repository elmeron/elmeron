import { act, reducer } from './util.js';
import Elmeron from '../services/elmeron/index.js';
import * as card from './card.js';
import * as grid from './grid.js';
import * as player from './player.js';
import * as ui from './ui.js';
import * as world from './world.js';
import * as refinery from './refinery.js';

const url = process.env.GAMESERVER_URL || 'http://localhost:3000';
let elmeron;

const SET_CONNECTED = 'elmeron/SET_CONNECTED';
const SET_CONNECTING = 'elmeron/SET_CONNECTING';
const SET_ERROR = 'elmeron/SET_ERROR';

const initialState = {
  connected: false,
  connecting: true,
  error: undefined,
};

export function initListeners() {
  return (dispatch, getState) => {
    elmeron = new Elmeron(url);

    elmeron.on('connect', () => dispatch(act(SET_CONNECTED, true)));
    elmeron.on('disonnect', () => dispatch(act(SET_CONNECTED, false)));
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
      dispatch(card.closeCard());
    });

    elmeron.on('getPlayer', ({ fuel, gems }) => {
      dispatch(player.setFuelData(fuel));
      dispatch(player.setGemData(gems));
    });

    elmeron.on('gameStart', ({ player: playerData, world: worldData }) => {
      dispatch(world.setCurrentLocation(worldData.name));
      dispatch(world.setParentLocation(worldData.parent));
      dispatch(world.setChildrenLocations(worldData.children));
      dispatch(world.setNodeType(worldData.nodeType));
      dispatch(world.setExplorationCost(worldData.explorationCost));
      dispatch(world.setTiles(worldData.tiles));
      dispatch(grid.setExtremes(worldData.tiles));
      dispatch(world.setIsExplored(worldData.isExplored));

      dispatch(player.setFuelData(playerData.fuel));
      dispatch(player.setGemData(playerData.gems));

      dispatch(ui.showLobbyCountdownView());
    });

    elmeron.on('elmeronFound', ({ q, r }) => {
      dispatch(grid.focus({ q, r }));
      dispatch(ui.showGameOverView());
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
  };
}

export function startGame(nickname) {
  elmeron.startGame(nickname);
  return act();
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

function handleSetConnected(state, value) {
  return state.set('connected', value).set('connecting', false);
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

const handlers = {
  [SET_CONNECTED]: handleSetConnected,
  [SET_CONNECTING]: handleSetConnecting,
  [SET_ERROR]: handleSetError,
};

export default reducer(initialState, handlers);
