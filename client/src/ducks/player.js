import { fromJS } from 'immutable';
import { act, reducer } from './util.js';

const SET_FUEL_DATA = 'player/SET_FUEL_DATA';
const SET_GEM_DATA = 'player/SET_GEM_DATA';

const initialState = {
  fuel: {},
  gems: {},
};

export function setFuelData(data) {
  return act(SET_FUEL_DATA, data);
}

export function setGemData(data) {
  return act(SET_GEM_DATA, data);
}

function handleSetFuelData(state, data) {
  return state.mergeIn(['fuel'], fromJS(data));
}

function handleSetGemData(state, data) {
  return state.mergeIn(['gems'], fromJS(data));
}

const handlers = {
  [SET_FUEL_DATA]: handleSetFuelData,
  [SET_GEM_DATA]: handleSetGemData,
};

export default reducer(initialState, handlers);
