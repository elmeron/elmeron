import { Set } from 'immutable';
import TerraformHandler from './terraform-handler.js';
import Unexplored from '../resources/unexplored.js';
import Void from '../resources/void.js';
import Tile from '../tile.js';
import PlanetDeck from '../planet-deck.js';
import PlanetNode from '../planet-node.js';

export default class FinishWorldExplorationHandler extends TerraformHandler {
  static canHandle(position, node, neighbours) {
    const tileNeighbours = neighbours.filterOut([new Unexplored(), new Void()]);

    if (tileNeighbours.size === 0) {
      return false;
    }

    const owners = tileNeighbours.tiles.reduce((result, tile) =>
      result.add(tile.owner),
      new Set()
    );

    return owners.some((owner) => {
      const ownerTiles = node.grid.filter(tile => tile.owner === owner);
      const surroundingOwner = node.grid.getSurroundingTiles(ownerTiles);
      const unexploredSurrounding = surroundingOwner.filter(tile =>
        tile.resource.equals(new Unexplored())
      );

      return unexploredSurrounding.size === 1;
    });
  }

  static makeTiles(position, node, neighbours) {
    const tileNeighbours = neighbours.filterOut([new Unexplored(), new Void()]);
    const voidTile = new Tile(position, new Void());

    const owners = tileNeighbours.tiles.reduce((result, tile) =>
      result.add(tile.owner),
      new Set()
    );
    const worlds = [];

    owners.forEach((owner) => {
      const ownerTiles = node.grid.filter(tile => tile.owner === owner);
      const surrounding = node.grid.getSurroundingTiles(ownerTiles);
      const unexploredSurrounding = surrounding.filter(({ resource }) =>
        resource.equals(new Unexplored())
      );

      if (unexploredSurrounding.size === 1) {
        const deck = new PlanetDeck();
        const planet = new PlanetNode(deck, owner);

        worlds.push(planet);
      }
    });

    const returnGrid = node.grid.populateUndefinedNeighbours(position, new Unexplored());
    returnGrid.addTile(voidTile);

    return { grid: returnGrid, worlds };
  }
}
