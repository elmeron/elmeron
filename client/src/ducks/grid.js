import { fromJS } from 'immutable';
import { act, reducer } from './util.js';
import { hexToPixel } from '../services/hex-util.js';
import config from '../../config.js';

const UPDATE_EXTREMES = 'grid/UPDATE_EXTREMES';

const initialState = {
  centerTile: {
    q: 0,
    r: 0,
  },
  extremes: {
    xMin: 0,
    xMax: 0,
    yMin: 0,
    yMax: 0,
  },
};

export function updateExtremes(hexagons) {
  return (dispatch, getState) => {
    const current = getState().grid.get('extremes').toJS();
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

function handleUpdateExtremes(state, extremes) {
  return state.set('extremes', fromJS(extremes));
}

const handlers = {
  [UPDATE_EXTREMES]: handleUpdateExtremes,
};

export default reducer(initialState, handlers);
