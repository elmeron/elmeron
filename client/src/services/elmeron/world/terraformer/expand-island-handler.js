import TerraformHandler from './terraform-handler.js';
import Unexplored from '../resources/unexplored.js';
import Ocean from '../resources/ocean.js';
import Tile from '../tile.js';

export default class ExpandIslandHandler extends TerraformHandler {
  static canHandle(position, node) {
    const neighbours = node.grid.getDefinedNeighbours(position, [
      new Unexplored(),
      new Ocean(),
    ]);

    if (node.deck.size === 0) {
      return false;
    }

    if (neighbours.size === 0) {
      return false;
    }

    const owner = neighbours.tiles.first().owner;

    if (neighbours.size > 1) {
      // make sure they point to the same world
      const sameOwner = neighbours.tiles.every(tile => tile.owner === owner);

      if (!sameOwner) {
        return false;
      }
    }

    const island = node.grid.filter(tile => tile.owner === owner);

    return island.size < 3;
  }

  static makeTiles(position, node) {
    const neighbours = node.grid.getDefinedNeighbours(position, [
      new Unexplored(),
      new Ocean(),
    ]);
    const redistribution = node.deck.redistribute(neighbours.toResourceDistribution());
    const pickedResource = redistribution.pick();

    const owner = neighbours.tiles.first().owner;
    const tile = new Tile(position, pickedResource, owner);
    const returnGrid = node.grid.populateUndefinedNeighbours(position, new Unexplored());

    returnGrid.addTile(tile);

    return { grid: returnGrid };
  }
}
