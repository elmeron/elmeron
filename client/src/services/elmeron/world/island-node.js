import Chance from 'chance';
import { Set } from 'immutable';
import WorldNode from './';
import IslandTerraformer from './terraformer/island-terraformer.js';
import Position from './position.js';
import Tile from './tile.js';
import Unexplored from './resources/unexplored.js';
import Refinery from './refinery.js';
import TileHexagonGrid from './tile-hexagon-grid.js';

const chance = new Chance();

export default class IslandNode extends WorldNode {
  constructor(deck, name) {
    super(deck, IslandTerraformer, name, 10);

    const startResource = deck.pick();
    const origo = new Position(0, 0);
    const neighbours = this.grid.populateUndefinedNeighbours(origo, new Unexplored());

    deck.remove(startResource);
    startResource.generateStartAmount();
    this.grid.addTile(new Tile(origo, startResource));
    this.grid.addTiles(neighbours.tiles);
    this.generateGems();
  }

  static getAffectedTiles(grid) {
    return grid.tiles.reduce((result, tile) => {
      const t = tile.clone();

      if (chance.bool({ likelihood: 5 })) {
        t.resource.canPickGem = !t.resource.canPickGem;
        return result.add(t);
      }

      return result;
    }, new Set());
  }

  generateGems() {
    setInterval(() => {
      const validTiles = this.grid.filter(({ owner, resource }) => {
        if (owner && owner.constructor.name === 'Refinery') {
          return false;
        }

        return resource.name !== 'Unexplored' && resource.name !== 'Ocean';
      });
      const affectedTiles = IslandNode.getAffectedTiles(validTiles);

      if (affectedTiles.size > 0) {
        const returnGrid = new TileHexagonGrid();

        returnGrid.addTiles(affectedTiles);
        this.grid.addTiles(affectedTiles);

        this.emit('explore', { tiles: returnGrid.getTiles() });
      }
    }, 1000);
  }

  buildRefinery(tiles, onRefineryChange = () => {}) {
    const grid = this.grid.getTiles(tiles);
    const refinery = new Refinery(grid, Date.now(), (deltaChange, updatedGrid) => {
      this.grid.addTiles(updatedGrid.tiles);
      this.emit('refineryChange', { tiles: updatedGrid.getTiles() });
      onRefineryChange(deltaChange);
    });

    this.grid.addTiles(refinery.grid.tiles);

    return {
      tiles: refinery.grid.getTiles(),
      delta: refinery.delta,
    };
  }
}
