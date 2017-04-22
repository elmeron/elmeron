import { Map } from 'immutable';
import { act, reducer } from './util.js';

const OPEN = 'card/OPEN';
const CLOSE = 'card/CLOSE';
const SET_DIMENSION = 'card/SET_DIMENSION';

const initialState = {
  open: false,
  anchor: {
    left: 0,
    top: 0,
    width: 0,
    height: 0,
  },
  component: null,
  width: 0,
  height: 0,
  direction: 'left',
};

export function openCard(anchor, component, direction) {
  return act(OPEN, { anchor, component, direction });
}

export function closeCard() {
  return act(CLOSE);
}

export function setCardDimension(width, height) {
  return act(SET_DIMENSION, { width, height });
}

function handleOpenCard(state, payload) {
  const { anchor, component, direction } = payload;
  const { left, top, width, height } = anchor.getBoundingClientRect();

  return state
    .set('open', true)
    .set('anchor', new Map({ left, top, width, height }))
    .set('component', component)
    .set('direction', direction);
}

function handleCloseCard(state) {
  return state.set('open', false);
}

function handleSetCardDimension(state, payload) {
  const { width, height } = payload;

  return state
    .set('width', width)
    .set('height', height);
}

const handlers = {
  [OPEN]: handleOpenCard,
  [CLOSE]: handleCloseCard,
  [SET_DIMENSION]: handleSetCardDimension,
};

export default reducer(initialState, handlers);
