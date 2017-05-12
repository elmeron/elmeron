import { fromJS } from 'immutable';
import { act, reducer } from './util.js';

const UPDATE_MARKET = 'market/UPDATE_MARKET';

const initialState = {};

export function updateMarket(gems) {
  return act(UPDATE_MARKET, gems);
}

function handleUpdateMarket(state, gems) {
  return fromJS(gems);
}

const handlers = {
  [UPDATE_MARKET]: handleUpdateMarket,
};

export default reducer(initialState, handlers);
