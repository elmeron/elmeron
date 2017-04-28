import { Set } from 'immutable';
import { calculateRefineryConstant } from '../refinery.js';

function makeTile(q, r, resource) {
  return {
    q,
    r,
    resource: {
      name: resource,
    },
  };
}

describe('refinery constant', () => {
  const availableTypes = new Set(['Forest', 'Rock', 'Sand']);

  test('no tiles', () => {
    const tiles = new Set();

    expect(calculateRefineryConstant(tiles, availableTypes)).toEqual(0);
  });

  test('1 forest tile', () => {
    const tiles = new Set([
      makeTile(0, 0, 'Forest'),
    ]);

    expect(calculateRefineryConstant(tiles, availableTypes)).toEqual(1);
  });

  test('2 forest tiles', () => {
    const tiles = new Set([
      makeTile(0, 0, 'Forest'),
      makeTile(0, 1, 'Forest'),
    ]);

    expect(calculateRefineryConstant(tiles, availableTypes)).toEqual(1);
  });

  test('1 forest, 1 rock tile', () => {
    const tiles = new Set([
      makeTile(0, 0, 'Forest'),
      makeTile(0, 1, 'Rock'),
    ]);

    expect(calculateRefineryConstant(tiles, availableTypes)).toEqual(1.9);
  });

  test('2 forest, 3 rock, 1 sand tile', () => {
    const tiles = new Set([
      makeTile(0, 0, 'Forest'),
      makeTile(0, 1, 'Forest'),
      makeTile(0, 2, 'Rock'),
      makeTile(0, 3, 'Rock'),
      makeTile(0, 4, 'Rock'),
      makeTile(0, 5, 'Sand'),
    ]);

    expect(calculateRefineryConstant(tiles, availableTypes)).toEqual(4.9);
  });
});
