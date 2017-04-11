import { fromJS, Map, Stack } from 'immutable';
import { act, reducer } from './util.js';
import { hexToPixel } from '../services/hex-util.js';
import config from '../../config.js';

const SET_STACK = 'grid/SET_STACK';
const UPDATE_EXTREMES = 'grid/UPDATE_EXTREMES';

const initialState = {
  centerTileStack: new Stack(fromJS([{
    q: 0,
    r: 0,
  }])),
  extremes: {
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
  },
};

// replace the current top of the stack and push a new origo position
export function zoomIn(position) {
  return (dispatch, getState) => {
    const { q, r } = position;
    let stack = getState().grid.get('centerTileStack');

    stack = stack.pop();
    stack = stack.push(new Map({ q, r }));
    stack = stack.push(new Map({ q: 0, r: 0 }));

    dispatch(act(SET_STACK, stack));
  };
}

export function zoomOut() {
  return (dispatch, getState) => {
    const stack = getState().grid.get('centerTileStack').pop();

    dispatch(act(SET_STACK, stack));
  };
}

export function updateExtremes(hexagons, extremes) {
  return (dispatch, getState) => {
    const current = extremes || getState().grid.get('extremes').toJS();
    let { xMin, xMax, yMin, yMax } = current;

    hexagons.forEach((hex) => {
      const { q, r } = hex;
      const { x: rX, y: rY } = hexToPixel(q, r);
      const halfWidth = config.tiles.size;
      const halfHeight = (Math.sqrt(3) / 2) * halfWidth;

      xMin = Math.min(xMin, rX - halfWidth);
      xMax = Math.max(xMax, rX + halfWidth);
      yMin = Math.min(yMin, rY - halfHeight);
      yMax = Math.max(yMax, rY + halfHeight);
    });

    dispatch(act(UPDATE_EXTREMES, { xMin, xMax, yMin, yMax }));
  };
}

export function setExtremes(hexagons) {
  return updateExtremes(hexagons, { xMin: 0, xMax: 0, yMin: 0, yMax: 0 });
}

function handleSetStack(state, stack) {
  return state.set('centerTileStack', stack);
}

function handleUpdateExtremes(state, extremes) {
  return state.set('extremes', fromJS(extremes));
}

const handlers = {
  [SET_STACK]: handleSetStack,
  [UPDATE_EXTREMES]: handleUpdateExtremes,
};

export default reducer(initialState, handlers);
