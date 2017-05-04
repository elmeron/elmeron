import TerraformHandler from './terraform-handler.js';
import TileHexagonGrid from '../tile-hexagon-grid.js';
import Tile from '../tile.js';
import Ocean from '../resources/ocean.js';
import Unexplored from '../resources/unexplored.js';

export default class IslandOceanHandler extends TerraformHandler {
  static canHandle(position, node) {
    const distance = node.grid.getDistanceToRelativeOrigo(position);
    const deckSize = node.deck.size;
    const neighbourSize = node.grid.getDefinedNeighbours(position, [
      new Ocean(),
      new Unexplored(),
    ]).size;
    const distanceExp = 0.5 * Math.exp(distance);
    const ratio = distanceExp / (distanceExp + Math.sqrt(deckSize * (1 + neighbourSize)));

    return Math.random() < ratio;
  }

  static makeTiles(position) {
    const returnGrid = new TileHexagonGrid();
    const tile = new Tile(position, new Ocean());

    returnGrid.addTile(tile);

    return { grid: returnGrid };
  }
}
