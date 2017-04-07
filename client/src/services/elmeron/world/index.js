/**
 * World Model entry point.
 */

import Chance from 'chance';
import { Map } from 'immutable';
import TileHexagonGrid from './tile-hexagon-grid.js';
import Unexplored from './resources/unexplored.js';
import Ocean from './resources/ocean.js';

function generateWorldName() {
  return new Chance().word();
}

export default class WorldNode {
  constructor(deck, terraformer, name = generateWorldName()) {
    this.deck = deck;
    this.terraformer = terraformer;
    this.name = name;
    this.grid = new TileHexagonGrid();
    this.children = new Map();
  }

  setChild(child) {
    const name = child.name;
    this.children = this.children.set(name, child);
  }

  getChild(name) {
    return this.children.get(name);
  }

  explore(position) {
    if (this.grid.isUnexploredTile(position)) {
      const neighbours = this.grid.getDefinedNeighbours(position);
      const { grid, worlds } = this.terraformer.makeTiles(position, this, neighbours);
      const addedResources = grid.filter(tile =>
        !tile.resource.equals(new Unexplored()) && !tile.resource.equals(new Ocean())
      );

      if (worlds) {
        worlds.forEach(child => this.setChild(child));
      }

      addedResources.forEach(({ resource }) => this.deck.remove(resource));
      this.grid.addTiles(grid.tiles);

      return grid.getTiles();
    }

    throw new Error(`
      Cannot explore: Position (${position.q}, ${position.r}) is not unexplored
    `);
  }

  exploreWhile(shouldExplore) {
    const unexploredTiles = this.grid.filter(tile => tile.resource.equals(new Unexplored()));

    if (unexploredTiles.size > 0) {
      const didExplore = unexploredTiles.tiles.some(({ position }) => {
        const neighbours = this.grid.getDefinedNeighbours(position);

        if (shouldExplore(neighbours)) {
          this.explore(position);
          return true;
        }

        return false;
      });

      if (didExplore) {
        this.exploreWhile(shouldExplore);
      }
    }
  }
}
