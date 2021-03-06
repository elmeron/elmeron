import TerraformHandler from './terraform-handler.js';
import Unexplored from '../resources/unexplored.js';
import Ocean from '../resources/ocean.js';
import Tile from '../tile.js';

export default class ExpandIslandHandler extends TerraformHandler {
  static canHandle(position, node, neighbours) {
    const tileNeighbours = neighbours.filterOut([new Unexplored(), new Ocean()]);
    const unexploredNeighbours = neighbours.filter(tile => tile.resource.equals(new Unexplored()));

    if (unexploredNeighbours.size === 0) {
      return false;
    }

    if (node.deck.size === 0) {
      return false;
    }

    if (tileNeighbours.size === 0) {
      return false;
    }

    const owner = tileNeighbours.tiles.first().owner;

    if (tileNeighbours.size > 1) {
      // make sure they point to the same world
      const sameOwner = tileNeighbours.tiles.every(tile => tile.owner === owner);

      if (!sameOwner) {
        return false;
      }
    }

    const island = node.grid.filter(tile => tile.owner === owner);
    const distance = island.getDistanceToRelativeOrigo(position);
    const distanceExp = Math.exp(distance);
    const ratio = distanceExp * (island.size / 15);

    return Math.random() > ratio;
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
