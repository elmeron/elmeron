import { act, reducer } from './util.js';

const SET_SCREEN_DIMENSION = 'ui/SET_SCREEN_DIMENSION';
const SET_VIEW = 'ui/SET_VIEW';

const initialState = {
  screenWidth: 0,
  screenHeight: 0,
  view: 'mainMenu',
};

export function setScreenDimension(width, height) {
  return act(SET_SCREEN_DIMENSION, { width, height });
}

export function showMainMenuView() {
  return act(SET_VIEW, 'mainMenu');
}

export function showLobbyView() {
  return act(SET_VIEW, 'lobby');
}

export function showLobbyCountdownView() {
  return act(SET_VIEW, 'lobbyCountdown');
}

export function showGameView() {
  return act(SET_VIEW, 'game');
}

export function showGameOverView() {
  return act(SET_VIEW, 'gameOver');
}

function handleSetScreenDimension(state, dimension) {
  const { width, height } = dimension;

  return state
    .set('screenWidth', width)
    .set('screenHeight', height);
}

function handleSetView(state, view) {
  return state.set('view', view);
}

const handlers = {
  [SET_SCREEN_DIMENSION]: handleSetScreenDimension,
  [SET_VIEW]: handleSetView,
};

export default reducer(initialState, handlers);
