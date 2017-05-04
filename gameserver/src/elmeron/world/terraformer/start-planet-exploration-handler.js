import Chance from 'chance';
import TerraformHandler from './terraform-handler.js';
import Void from '../resources/void.js';
import Unexplored from '../resources/unexplored.js';
import UnknownResource from '../resources/unknown.js';
import WorldNode from '../';
import TileHexagonGrid from '../tile-hexagon-grid.js';
import Tile from '../tile.js';

const chance = new Chance();

export default class StartPlanetExplorationHandler extends TerraformHandler {
  static canHandle(position, node, neighbours) {
    const hasNoTiles = neighbours.every(tile =>
      tile.resource.equals(new Void()) || tile.resource.equals(new Unexplored())
    ) && node.deck.size > 0;

    return hasNoTiles && chance.bool({ likelihood: 10 });
  }

  static makeTiles(position, node) {
    const returnGrid = new TileHexagonGrid();
    const resource = new UnknownResource();
    const tempWorld = new WorldNode();
    const unexploredNeighbours = node.grid.populateUndefinedNeighbours(position, new Unexplored());

    returnGrid.addTile(new Tile(position, resource, tempWorld.name));
    returnGrid.addTiles(unexploredNeighbours.tiles);

    return {
      grid: returnGrid,
    };
  }
}
