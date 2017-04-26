import { Set } from 'immutable';
import { getDefinedNeighbours, getSurroundingTiles } from '../hex-util';

function makeTile(q, r, resource) {
  return {
    q,
    r,
    resource: {
      name: resource,
    },
  };
}

describe('get defined neighbours', () => {
  test('no neighbours', () => {
    const tiles = new Set([
      makeTile(0, 0, 'Forest'),
    ]);
    const result = getDefinedNeighbours(makeTile(0, 0), tiles);

    expect(result.size).toBe(0);
  });

  test('all neighbours', () => {
    const tiles = new Set([
      makeTile(0, 0),
      makeTile(0, -1),
      makeTile(1, -1),
      makeTile(1, 0),
      makeTile(0, 1),
      makeTile(-1, 1),
      makeTile(-1, 0),
    ]);
    const result = getDefinedNeighbours(makeTile(0, 0), tiles);

    expect(result.size).toBe(6);
  });

  test('ignore', () => {
    const tiles = new Set([
      makeTile(0, 0),
      makeTile(0, -1, 'Forest'),
      makeTile(1, -1),
      makeTile(1, 0),
      makeTile(0, 1),
      makeTile(-1, 1),
      makeTile(-1, 0),
    ]);
    const result = getDefinedNeighbours(makeTile(0, 0), tiles, tile =>
      tile.resource.name === 'Forest'
    );

    expect(result.size).toBe(5);
  });
});

describe('get surrounding tiles', () => {
  test('no neighbours', () => {
    const selectedTiles = new Set([
      makeTile(0, 0),
    ]);
    const allTiles = new Set([
      makeTile(0, 0),
    ]);
    const result = getSurroundingTiles(selectedTiles, allTiles);

    expect(result.size).toBe(0);
  });

  test('one neighbour', () => {
    const selectedTiles = new Set([
      makeTile(0, 0),
    ]);
    const allTiles = new Set([
      makeTile(0, 0),
      makeTile(0, 1),
    ]);
    const result = getSurroundingTiles(selectedTiles, allTiles);

    expect(result.size).toBe(1);
    expect(result.first()).toEqual(makeTile(0, 1));
  });

  test('ignore', () => {
    const selectedTiles = new Set([
      makeTile(0, 0),
    ]);
    const allTiles = new Set([
      makeTile(0, 0),
      makeTile(0, 1),
      makeTile(1, 0, 'Forest'),
    ]);
    const result = getSurroundingTiles(selectedTiles, allTiles, tile =>
      tile.resource.name === 'Forest'
    );

    expect(result.size).toBe(1);
    expect(result.first()).toEqual(makeTile(0, 1));
  });

  test('use case example', () => {
    const selectedTiles = new Set([
      makeTile(0, 0, 'Forest'),
      makeTile(0, -1, 'Forest'),
    ]);
    const allTiles = [
      makeTile(0, -1, 'Forest'),
      makeTile(1, -2, 'Unexplored'),
      makeTile(0, -2, 'Unexplored'),
      makeTile(-1, 0, 'Ocean'),
      makeTile(-1, 1, 'Ocean'),
      makeTile(-1, -1, 'Unexplored'),
      makeTile(0, 0, 'Forest'),
      makeTile(1, 0, 'Unexplored'),
      makeTile(0, 1, 'Unexplored'),
      makeTile(1, -1, 'Unexplored'),
    ];
    const result = getSurroundingTiles(selectedTiles, allTiles, ({ resource, owner }) => {
      const { name } = resource;
      const type = owner && owner.type;
      return name === 'Unexplored' || name === 'Ocean' || type === 'Refinery';
    });

    expect(result.size).toBe(0);
  });
});
