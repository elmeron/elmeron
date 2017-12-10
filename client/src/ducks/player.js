import { fromJS } from 'immutable';
import { act, reducer } from './util.js';

const RESET = 'players/RESET';
const SET_FUEL_DATA = 'player/SET_FUEL_DATA';
const SET_GEM_DATA = 'player/SET_GEM_DATA';
const SET_HAS_EXPLORED_FIRST_ISLAND = 'player/SET_HAS_EXPLORED_FIRST_ISLAND';
const SET_EXPLORATION_COST = 'player/SET_EXPLORATION_COST';
const SET_EXPLORED_TILES = 'player/SET_EXPLORED_TILES';
const SET_FUEL_AMOUNT = 'player/SET_FUEL_AMOUNT';
const SET_FUEL_DELTA = 'player/SET_FUEL_DELTA';

const initialState = {
  fuel: {},
  fuelAmount: 0,
  fuelDelta: 0,
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

export function setFuelAmount(amount) {
  return act(SET_FUEL_AMOUNT, amount);
}

export function setFuelDelta(delta) {
  return act(SET_FUEL_DELTA, delta);
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

function handleSetFuelAmount(state, amount) {
  return state.set('fuelAmount', amount);
}

function handleSetFuelDelta(state, delta) {
  return state.set('fuelDelta', delta);
}

const handlers = {
  [RESET]: handleResetData,
  [SET_FUEL_DATA]: handleSetFuelData,
  [SET_GEM_DATA]: handleSetGemData,
  [SET_HAS_EXPLORED_FIRST_ISLAND]: handleSetHasExploredFirstIsland,
  [SET_EXPLORATION_COST]: handleSetExplorationCost,
  [SET_EXPLORED_TILES]: handleSetExploredTiles,
  [SET_FUEL_AMOUNT]: handleSetFuelAmount,
  [SET_FUEL_DELTA]: handleSetFuelDelta,
};

export default reducer(initialState, handlers);
