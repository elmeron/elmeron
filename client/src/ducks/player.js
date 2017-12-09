import { fromJS } from 'immutable';
import { act, reducer } from './util.js';

const RESET = 'players/RESET';
const SET_FUEL_DATA = 'player/SET_FUEL_DATA';
const SET_GEM_DATA = 'player/SET_GEM_DATA';
const SET_HAS_EXPLORED_FIRST_ISLAND = 'player/SET_HAS_EXPLORED_FIRST_ISLAND';
const SET_EXPLORATION_COST = 'player/SET_EXPLORATION_COST';
const SET_EXPLORED_TILES = 'player/SET_EXPLORED_TILES';

const initialState = {
  fuel: {},
  gems: {},
  hasExploredFirstIsland: false,
  explorationCost: 0,
  exploredTiles: {},
};

export function resetData() {
  return act(RESET);
}

export function setFuelData(data) {
  return act(SET_FUEL_DATA, data);
}

export function setGemData(data) {
  return act(SET_GEM_DATA, data);
}

export function setHasExploredFirstIsland(value = true) {
  return act(SET_HAS_EXPLORED_FIRST_ISLAND, value);
}

export function setExplorationCost(value) {
  return act(SET_EXPLORATION_COST, value);
}

export function setExploredTiles(data) {
  return act(SET_EXPLORED_TILES, data);
}

function handleResetData() {
  return fromJS(initialState);
}

function handleSetFuelData(state, data) {
  return state.mergeIn(['fuel'], fromJS(data));
}

function handleSetGemData(state, data) {
  return state.mergeIn(['gems'], fromJS(data));
}

function handleSetHasExploredFirstIsland(state, value) {
  return state.set('hasExploredFirstIsland', value);
}

function handleSetExplorationCost(state, value) {
  return state.set('explorationCost', value);
}

function handleSetExploredTiles(state, data) {
  return state.mergeIn(['exploredTiles'], fromJS(data));
}

const handlers = {
  [RESET]: handleResetData,
  [SET_FUEL_DATA]: handleSetFuelData,
  [SET_GEM_DATA]: handleSetGemData,
  [SET_HAS_EXPLORED_FIRST_ISLAND]: handleSetHasExploredFirstIsland,
  [SET_EXPLORATION_COST]: handleSetExplorationCost,
  [SET_EXPLORED_TILES]: handleSetExploredTiles,
};

export default reducer(initialState, handlers);
