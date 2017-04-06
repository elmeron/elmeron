import TerraformHandler from './terraform-handler.js';
import Tile from '../tile.js';
import Unexplored from '../resources/unexplored.js';
import Ocean from '../resources/ocean.js';

export default class IslandTileHandler extends TerraformHandler {
  static canHandle() {
    return true;
  }

  static makeTiles(position, node) {
    const deck = node.deck;

    if (deck.size > 0) {
      const grid = node.grid;
      const neighbours = grid.getDefinedNeighbours(position, [
        new Ocean(),
        new Unexplored(),
      ]).toResourceDistribution();
      const redistribution = deck.redistribute(neighbours);
      const pickedResource = redistribution.pick();

      deck.remove(pickedResource);
      const tile = new Tile(position, pickedResource);
      const returnGrid = grid.populateUndefinedNeighbours(position, new Unexplored());

      grid.addTile(tile);
      returnGrid.addTile(tile);

      return returnGrid;
    }

    return undefined;
  }
}
