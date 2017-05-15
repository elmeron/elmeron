import { Map } from 'immutable';

function mapTilesToVector(tiles, availableResourceTypes) {
  return availableResourceTypes.reduce((result, resource) => {
    const count = tiles.count(tile => tile.resource.name === resource);
    return result.set(resource, count);
  }, new Map()).toIndexedSeq();
}

function dot(v1, v2) {
  return v1.reduce((result, val, index) => {
    let r = result;
    r += v1.get(index) * v2.get(index);
    return r;
  }, 0);
}

function length(v) {
  return Math.sqrt(v.reduce((result, val) => {
    let r = result;
    r += val * val;
    return r;
  }, 0));
}

function angle(v1, v2) {
  const d = dot(v1, v2);
  const l1 = length(v1);
  const l2 = length(v2);

  return Math.acos(d / (l1 * l2)).toFixed(2);
}

function makeUnitVector(vector, index) {
  return vector.map((val, i) => {
    if (i === index) {
      return 1;
    }
    return 0;
  });
}

function calculateSmallestAngle(vector) {
  const angles = vector.map((val, index) => {
    const e = makeUnitVector(vector, index);

    return angle(vector, e);
  });

  return Math.min(...angles);
}

function calculateVectorFactor(vectorLength, availableTypes, smallestAngle) {
  return Math.sqrt(vectorLength * vectorLength * Math.sqrt(availableTypes) * smallestAngle);
}

function calculateVariationFactor(usedTypes, availableTypes) {
  return (Math.exp(usedTypes / availableTypes) - 1) / (Math.exp(1) - 1);
}

export function calculateRefineryConstant(tiles, availableResourceTypes) {
  if (tiles.size === 0) {
    return 0;
  }

  const vector = mapTilesToVector(tiles, availableResourceTypes);
  const vectorLength = length(vector);
  const smallestAngle = calculateSmallestAngle(vector);
  const usedTypes = vector.count(v => v > 0);
  const availableTypes = availableResourceTypes.size;
  const vectorFactor = calculateVectorFactor(vectorLength, availableTypes, smallestAngle);
  const variationFactor = calculateVariationFactor(usedTypes, availableTypes);

  return parseFloat((vectorFactor * variationFactor).toFixed(1));
}

export function calculateRefineryCost(tiles, availableTypes) {
  const refineryConstant = Math.round(calculateRefineryConstant(tiles, availableTypes));

  return tiles.reduce((result, tile) => {
    const { name } = tile.resource;
    const amount = result.get(name) || 0;

    return result.set(name, amount + refineryConstant);
  }, new Map());
}

export function calculateRefineryProduction(tiles, availableTypes) {
  return parseFloat((tiles.size * calculateRefineryConstant(tiles, availableTypes)).toFixed(1));
}

export function calculateFuelPrice(refineryProduction, required, available) {
  if (available > 0) {
    if (required === 0) {
      return 0;
    }

    const price = Math.round((required * refineryProduction) / available);

    return Math.max(price, 1);
  }

  throw new Error('Cannot calculate fuel price: No gems available globally');
}
