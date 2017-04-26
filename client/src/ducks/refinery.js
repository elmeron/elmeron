import { Set } from 'immutable';
import { reducer, act } from './util.js';

const START_MONITORING = 'refinery/START_MONITORING';
const STOP_MONITORING = 'refinery/STOP_MONITORING';
const RESET_TILES = 'refinery/RESET_TILES';
const SELECT_TILE = 'refinery/SELECT_TILE';
const DESELECT_TILE = 'refinery/DESELECT_TILE';

const initialState = {
  monitoring: false,
  selectedTiles: new Set(),
};

export function startMonitoring() {
  return act(START_MONITORING);
}

export function stopMonitoring() {
  return act(STOP_MONITORING);
}

export function resetSelectedTiles() {
  return act(RESET_TILES);
}

export function selectTile(tile) {
  return act(SELECT_TILE, tile);
}

export function deselectTile(tile) {
  return act(DESELECT_TILE, tile);
}

function handleStartMonitoring(state) {
  return state.set('monitoring', true);
}

function handleStopMonitoring(state) {
  return state.set('monitoring', false);
}

function handleResetSelectedTiles(state) {
  return state.set('selectedTiles', new Set());
}

function handleSelectTile(state, tile) {
  const list = state.get('selectedTiles').add(tile);

  return state.set('selectedTiles', list);
}

function handleDeselectTile(state, tile) {
  const list = state.get('selectedTiles').delete(tile);

  return state.set('selectedTiles', list);
}

const handlers = {
  [START_MONITORING]: handleStartMonitoring,
  [STOP_MONITORING]: handleStopMonitoring,
  [RESET_TILES]: handleResetSelectedTiles,
  [SELECT_TILE]: handleSelectTile,
  [DESELECT_TILE]: handleDeselectTile,
};

export default reducer(initialState, handlers);
