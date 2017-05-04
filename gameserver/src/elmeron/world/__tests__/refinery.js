// import Refinery from '../refinery.js';
import TileHexagonGrid from '../tile-hexagon-grid.js';
import CountableResource from '../countable-resource.js';
import Tile from '../tile.js';
import Position from '../position.js';

function makeResource(name) {
  return new CountableResource(name, 0, 1);
}

test('constructor', () => {
  const grid = new TileHexagonGrid();

  grid.addTiles([
    new Tile(new Position(0, 0), makeResource('forest')),
    new Tile(new Position(0, 1), makeResource('rock')),
  ]);

  // this test is not complete
  // const refinery = new Refinery(grid, 0, 1);
});
