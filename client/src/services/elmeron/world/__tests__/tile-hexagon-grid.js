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
