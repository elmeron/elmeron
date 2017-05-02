import { act, reducer } from './util.js';

const OPEN = 'card/OPEN';
const CLOSE = 'card/CLOSE';
const SET_DIMENSION = 'card/SET_DIMENSION';

const initialState = {
  open: false,
  anchor: undefined,
  component: null,
  width: 0,
  height: 0,
  direction: 'left',
};

export function openCard(anchor, component, direction) {
  return act(OPEN, { anchor, component, direction });
}

export function closeCard() {
  return (dispatch, getState) => {
    if (getState().card.get('open')) {
      return dispatch(act(CLOSE));
    }

    return dispatch(act());
  };
}

export function setCardDimension(width, height) {
  return act(SET_DIMENSION, { width, height });
}

function handleOpenCard(state, { anchor, component, direction }) {
  return state
    .set('open', true)
    .set('anchor', anchor)
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
