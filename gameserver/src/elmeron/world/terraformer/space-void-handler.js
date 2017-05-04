import TerraformHandler from './terraform-handler.js';
import Tile from '../tile.js';
import Unexplored from '../resources/unexplored.js';
import Void from '../resources/void.js';

export default class SpaceVoidHandler extends TerraformHandler {
  static canHandle() {
    return true;
  }

  static makeTiles(position, node) {
    const voidResource = new Tile(position, new Void());
    const returnGrid = node.grid.populateUndefinedNeighbours(position, new Unexplored());

    returnGrid.addTile(voidResource);

    return { grid: returnGrid };
  }
}
