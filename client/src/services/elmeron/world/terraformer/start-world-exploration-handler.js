import TerraformHandler from './terraform-handler.js';
import Ocean from '../resources/ocean.js';
import Unexplored from '../resources/unexplored.js';
import TileHexagonGrid from '../tile-hexagon-grid.js';
import Tile from '../tile.js';
import WorldNode from '../';

export default class StartWorldExplorationHandler extends TerraformHandler {
  static canHandle(position, node, neighbours) {
    return neighbours.every(tile =>
      tile.resource.equals(new Ocean()) || tile.resource.equals(new Unexplored())
    );
  }

  static makeTiles(position, node) {
    const returnGrid = new TileHexagonGrid();
    const pickedResource = node.deck.pick();
    const tempWorld = new WorldNode();
    const unexploredNeighbours = node.grid.populateUndefinedNeighbours(position, new Unexplored());

    returnGrid.addTile(new Tile(position, pickedResource, tempWorld.name));
    returnGrid.addTiles(unexploredNeighbours.tiles);

    return {
      grid: returnGrid,
      world: tempWorld,
    };
  }
}
