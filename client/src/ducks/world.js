import { fromJS } from 'immutable';
import { act, reducer } from './util.js';

const SET_TILES = 'world/SET_TILES';

const initialState = {
  tiles: [
    { q: 0, r: 0, type: 'forest' },
    { q: 0, r: 1, type: 'sand' },
    { q: 1, r: 0, type: 'rock' },
  ],
};

export function setTiles(tiles) {
  return act(SET_TILES, tiles);
}

function handleSetTiles(state, tiles) {
  return state.set('tiles', fromJS(tiles));
}

const handlers = {
  [SET_TILES]: handleSetTiles,
};

export default reducer(initialState, handlers);
