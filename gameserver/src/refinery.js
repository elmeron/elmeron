'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.calculateRefineryConstant = calculateRefineryConstant;
exports.calculateRefineryCost = calculateRefineryCost;
exports.calculateRefineryProduction = calculateRefineryProduction;

var _immutable = require('immutable');

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function mapTilesToVector(tiles, availableResourceTypes) {
  return availableResourceTypes.reduce(function (result, resource) {
    var count = tiles.count(function (tile) {
      return tile.resource.name === resource;
    });
    return result.set(resource, count);
  }, new _immutable.Map()).toIndexedSeq();
}

function dot(v1, v2) {
  return v1.reduce(function (result, val, index) {
    var r = result;
    r += v1.get(index) * v2.get(index);
    return r;
  }, 0);
}

function length(v) {
  return Math.sqrt(v.reduce(function (result, val) {
    var r = result;
    r += val * val;
    return r;
  }, 0));
}

function angle(v1, v2) {
  var d = dot(v1, v2);
  var l1 = length(v1);
  var l2 = length(v2);

  return Math.acos(d / (l1 * l2)).toFixed(2);
}

function makeUnitVector(vector, index) {
  return vector.map(function (val, i) {
    if (i === index) {
      return 1;
    }
    return 0;
  });
}

function calculateSmallestAngle(vector) {
  var angles = vector.map(function (val, index) {
    var e = makeUnitVector(vector, index);

    return angle(vector, e);
  });

  return Math.min.apply(Math, _toConsumableArray(angles));
}

function calculateVectorFactor(vectorLength, availableTypes, smallestAngle) {
  return Math.sqrt(vectorLength * vectorLength * Math.sqrt(availableTypes) * smallestAngle);
}

function calculateVariationFactor(usedTypes, availableTypes) {
  return (Math.exp(usedTypes / availableTypes) - 1) / (Math.exp(1) - 1);
}

function calculateRefineryConstant(tiles, availableResourceTypes) {
  if (tiles.size === 0) {
    return 0;
  }

  var vector = mapTilesToVector(tiles, availableResourceTypes);
  var vectorLength = length(vector);
  var smallestAngle = calculateSmallestAngle(vector);
  var usedTypes = vector.count(function (v) {
    return v > 0;
  });
  var availableTypes = availableResourceTypes.size;
  var vectorFactor = calculateVectorFactor(vectorLength, availableTypes, smallestAngle);
  var variationFactor = calculateVariationFactor(usedTypes, availableTypes);

  return parseFloat((vectorFactor * variationFactor).toFixed(1));
}

function calculateRefineryCost(tiles, availableTypes) {
  var refineryConstant = Math.round(calculateRefineryConstant(tiles, availableTypes));

  return tiles.reduce(function (result, tile) {
    var name = tile.resource.name;

    var amount = result.get(name) || 0;

    return result.set(name, amount + refineryConstant);
  }, new _immutable.Map());
}

function calculateRefineryProduction(tiles, availableTypes) {
  return parseFloat((tiles.size * calculateRefineryConstant(tiles, availableTypes)).toFixed(1));
}
