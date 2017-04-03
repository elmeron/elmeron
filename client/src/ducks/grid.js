import { fromJS } from 'immutable';
import { act, reducer } from './util.js';
import { hexToPixel } from '../services/hex-util.js';
import config from '../../config.js';

const CALCULATE_EXTREMES = 'grid/CALCULATE_EXTREMES';

const initialState = {
  zoom: 1,
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

export function calculateExtremes(hexagons, zoom) {
  const halfWidth = config.tiles.size;
  const halfHeight = (Math.sqrt(3) / 2) * halfWidth;
  const { q: rQ, r: rR } = hexagons[0] || { q: 0, r: 0 };
  const { x, y } = hexToPixel(rQ, rR, zoom);

  let xMin = x;
  let xMax = x;
  let yMin = y;
  let yMax = y;

  hexagons.forEach((hex) => {
    const { q, r } = hex;
    const { x: rX, y: rY } = hexToPixel(q, r, zoom);

    xMin = Math.min(xMin, rX);
    xMax = Math.max(xMax, rX);
    yMin = Math.min(yMin, rY);
    yMax = Math.max(yMax, rY);
  });

  return act(CALCULATE_EXTREMES, {
    xMin: xMin - halfWidth,
    xMax: xMax + halfWidth,
    yMin: yMin - halfHeight,
    yMax: yMax + halfHeight,
  });
}

function handleCalculateExtremes(state, extremes) {
  return state.set('extremes', fromJS(extremes));
}

const handlers = {
  [CALCULATE_EXTREMES]: handleCalculateExtremes,
};

export default reducer(initialState, handlers);
