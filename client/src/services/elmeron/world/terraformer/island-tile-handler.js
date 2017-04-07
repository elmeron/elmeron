import TerraformHandler from './terraform-handler.js';
import Tile from '../tile.js';
import Unexplored from '../resources/unexplored.js';
import Ocean from '../resources/ocean.js';

export default class IslandTileHandler extends TerraformHandler {
  static canHandle() {
    return true;
  }

  static makeTiles(position, node) {
    const neighbours = node.grid.getDefinedNeighbours(position, [
      new Ocean(),
      new Unexplored(),
    ]).toResourceDistribution();
    const redistribution = node.deck.redistribute(neighbours);
    const pickedResource = redistribution.pick();

    const tile = new Tile(position, pickedResource);
    const returnGrid = node.grid.populateUndefinedNeighbours(position, new Unexplored());

    returnGrid.addTile(tile);

    return { grid: returnGrid };
  }
}
