import { reducer } from './util.js';

const initialState = {
  tile1: { q: 0, r: 0, type: 'forest' },
  tile2: { q: 0, r: 1, type: 'sand' },
  tile3: { q: 1, r: 0, type: 'rock' },
};
const handlers = {};

export default reducer(initialState, handlers);
