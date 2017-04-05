import { fromJS, Map } from 'immutable';
import { act, reducer } from './util.js';

const MERGE_TILES = 'world/MERGE_TILES';

const initialState = {
  tiles: {},
};

export function mergeTiles(tiles) {
  return act(MERGE_TILES, tiles);
}

function handleMergeTiles(state, tiles) {
  const reducedTiles = tiles.reduce((result, tile) => {
    const { q, r } = tile;
    const key = `${q},${r}`;
    return result.set(key, fromJS(tile));
  }, new Map());

  return state.mergeIn(['tiles'], reducedTiles);
}

const handlers = {
  [MERGE_TILES]: handleMergeTiles,
};

export default reducer(initialState, handlers);
