import { fromJS } from 'immutable';
import { act, reducer } from './util.js';

const SET_FUEL_DATA = 'player/SET_FUEL_DATA';

const initialState = {
  fuel: {},
};

export function setFuelData(data) {
  return act(SET_FUEL_DATA, data);
}

function handleSetFuelData(state, data) {
  return state.mergeIn(['fuel'], fromJS(data));
}

const handlers = {
  [SET_FUEL_DATA]: handleSetFuelData,
};

export default reducer(initialState, handlers);
