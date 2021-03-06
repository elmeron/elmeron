import { Set } from 'immutable';
import TerraformHandler from './terraform-handler.js';
import Unexplored from '../resources/unexplored.js';
import Ocean from '../resources/ocean.js';
import Tile from '../tile.js';
import IslandDeck from '../island-deck.js';
import IslandNode from '../island-node.js';

export default class FinishIslandExplorationHandler extends TerraformHandler {
  static canHandle(position, node, neighbours) {
    const tileNeighbours = neighbours.filterOut([new Unexplored(), new Ocean()]);

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
    const tileNeighbours = neighbours.filterOut([new Unexplored(), new Ocean()]);
    const returnGrid = node.grid.populateUndefinedNeighbours(position, new Unexplored());
    const ocean = new Tile(position, new Ocean());

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
        const biase = ownerTiles.toResourceDistribution();
        const deck = new IslandDeck(biase);
        const island = new IslandNode(deck, owner);

        worlds.push(island);
      }
    });

    returnGrid.addTile(ocean);

    return { grid: returnGrid, worlds };
  }
}
