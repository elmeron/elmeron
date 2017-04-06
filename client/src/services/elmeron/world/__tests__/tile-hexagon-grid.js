import { Range as range } from 'immutable';
import TileHexagonGrid from '../tile-hexagon-grid.js';
import Position from '../position.js';
import Resource from '../resource';
import Tile from '../tile.js';
import Unexplored from '../resources/unexplored.js';

test('add tile', () => {
  const tileGrid = new TileHexagonGrid();
  const tile = new Tile(new Position(0, 0), new Resource('resource'));

  tileGrid.addTile(tile);

  expect(tileGrid.tiles.size).toBe(1);
});

test('add tiles', () => {
  const tileGrid = new TileHexagonGrid();
  const tiles = [
    new Tile(new Position(0, 0), new Resource('resource')),
    new Tile(new Position(0, 1), new Resource('resource')),
  ];

  tileGrid.addTiles(tiles);

  expect(tileGrid.tiles.size).toBe(2);
});

test('add conflicting tiles', () => {
  const tileGrid = new TileHexagonGrid();
  const conflictingTile = new Tile(new Position(0, 0), new Resource('conflicting resource'));
  const tiles = [
    new Tile(new Position(0, 0), new Resource('resource')),
    new Tile(new Position(0, 1), new Resource('resource')),
  ];

  tileGrid.addTile(conflictingTile);
  tileGrid.addTiles(tiles);

  expect(tileGrid.tiles.size).toBe(2);
});

test('get tile', () => {
  const tileGrid = new TileHexagonGrid();
  const tile = new Tile(new Position(0, 0), new Resource('resource'));

  tileGrid.addTile(tile);

  expect(tileGrid.getTile(new Position(0, 0))).toBe(tile);
});

test('populate undefined neighbours', () => {
  const tileGrid = new TileHexagonGrid();
  const origo = new Position(0, 0);

  tileGrid.addTile(new Tile(origo, new Resource('resource')));
  const neighbours = tileGrid.populateUndefinedNeighbours(origo, new Unexplored());

  expect(tileGrid.tiles.size).toBe(7);
  expect(neighbours.tiles.size).toBe(6);
});

test('is unexplored tile', () => {
  const grid = new TileHexagonGrid();
  const origo = new Position(0, 0);
  const unexploredTile = new Tile(origo, new Unexplored());

  grid.addTile(unexploredTile);

  expect(grid.isUnexploredTile(origo)).toBeTruthy();
});

test('get defined neighbours', () => {
  const grid = new TileHexagonGrid();
  const resource = new Resource('Resource');

  grid.addTile(new Tile(new Position(0, 0), resource));
  grid.addTile(new Tile(new Position(1, 0), resource));

  expect(grid.getDefinedNeighbours(new Position(0, 0)).size).toBe(1);
});

test('get defined neighbours with ignore', () => {
  const grid = new TileHexagonGrid();
  const resource = new Resource('Resource');
  const ignore = new Resource('IgnoreMe');

  grid.addTile(new Tile(new Position(0, 0), resource));
  grid.addTile(new Tile(new Position(0, 1), ignore));

  const neighbours = grid.getDefinedNeighbours(new Position(0, 0), [ignore]);

  expect(neighbours.size).toBe(0);
});

test('convert to distribution', () => {
  const grid = new TileHexagonGrid();
  const forest = new Resource('Forest');
  const rock = new Resource('Rock');

  range(0, 10).forEach(i => grid.addTile(new Tile(new Position(0, i), forest)));
  range(0, 5).forEach(i => grid.addTile(new Tile(new Position(1, i), rock)));

  const distribution = grid.toResourceDistribution();

  expect(distribution.count(forest)).toBe(10);
  expect(distribution.count(rock)).toBe(5);
});

test('extremes', () => {
  const grid = new TileHexagonGrid();
  const resource = new Resource('Resource');

  grid.addTile(new Tile(new Position(0, 0), resource));

  let expected = { qMin: 0, qMax: 0, rMin: 0, rMax: 0 };

  expect(grid.extremes).toEqual(expected);

  grid.addTile(new Tile(new Position(10, 0), resource));
  expected = { qMin: 0, qMax: 10, rMin: 0, rMax: 0 };
});

test('relative origo', () => {
  const grid = new TileHexagonGrid();
  grid.addTile(new Tile(new Position(0, 0), new Resource('Resource')));
  let distance = grid.getDistanceToRelativeOrigo(new Position(1, 0));

  expect(distance).toBe(1);

  distance = grid.getDistanceToRelativeOrigo(new Position(0, 5));

  expect(distance).toBe(5);
});
