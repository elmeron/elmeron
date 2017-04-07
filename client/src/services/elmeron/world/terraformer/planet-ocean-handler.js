import TerraformHandler from './terraform-handler.js';
import Tile from '../tile.js';
import Unexplored from '../resources/unexplored.js';
import Ocean from '../resources/ocean.js';

export default class PlanetOceanHandler extends TerraformHandler {
  static canHandle() {
    return true;
  }

  static makeTiles(position, node) {
    const ocean = new Tile(position, new Ocean());
    const returnGrid = node.grid.populateUndefinedNeighbours(position, new Unexplored());

    returnGrid.addTile(ocean);

    return { grid: returnGrid };
  }
}
