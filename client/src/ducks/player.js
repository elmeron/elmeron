import { fromJS } from 'immutable';
import { act, reducer } from './util.js';

const RESET = 'players/RESET';
const SET_FUEL_DATA = 'player/SET_FUEL_DATA';
const SET_GEM_DATA = 'player/SET_GEM_DATA';
const SET_HAS_EXPLORED_FIRST_ISLAND = 'player/SET_HAS_EXPLORED_FIRST_ISLAND';
const SET_EXPLORATION_COST = 'player/SET_EXPLORATION_COST';

const initialState = {
  fuel: {},
  gems: {},
  hasExploredFirstIsland: false,
  explorationCost: 0,
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

const handlers = {
  [RESET]: handleResetData,
  [SET_FUEL_DATA]: handleSetFuelData,
  [SET_GEM_DATA]: handleSetGemData,
  [SET_HAS_EXPLORED_FIRST_ISLAND]: handleSetHasExploredFirstIsland,
  [SET_EXPLORATION_COST]: handleSetExplorationCost,
};

export default reducer(initialState, handlers);
