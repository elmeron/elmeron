/**
 * World Model entry point.
 */

import Chance from 'chance';
import EventEmitter from 'events';
import { Map } from 'immutable';
import TileHexagonGrid from './tile-hexagon-grid.js';
import Unexplored from './resources/unexplored.js';
import Ocean from './resources/ocean.js';

const chance = new Chance();

export default class WorldNode extends EventEmitter {
  constructor(deck, terraformer, name) {
    super();
    this.deck = deck;
    this.terraformer = terraformer;
    this.name = name;
    this.grid = new TileHexagonGrid();
    this.children = new Map();
    this.explorationCost = this.getExplorationCost();
    this.isExplored = false;
  }

  static generateWorldName(prefix) {
    const randomWord = chance.word();
    const proper = randomWord.charAt(0).toUpperCase() + randomWord.substr(1);

    return `${proper} ${prefix}`;
  }

  getNodeType() {
    return this.constructor.name;
  }

  setChild(child) {
    const c = child;
    const name = c.name;

    c.parent = this;
    this.children = this.children.set(name, child);
  }

  getChild(name) {
    return this.children.get(name);
  }

  getChildren() {
    return this.children.keySeq().toJS();
  }

  getData() {
    const parent = this.parent ? this.parent.name : undefined;

    return {
      name: this.name,
      parent,
      tiles: this.grid.getTiles(),
      children: this.getChildren(),
      nodeType: this.getNodeType(),
      explorationCost: this.explorationCost,
      isExplored: this.isExplored,
    };
  }

  explore(position, player) {
    if (this.grid.isUnexploredTile(position)) {
      const neighbours = this.grid.getDefinedNeighbours(position);
      const { grid, worlds } = this.terraformer.makeTiles(position, this, neighbours, player);
      const addedResources = grid.filter(tile =>
        !tile.resource.equals(new Unexplored()) && !tile.resource.equals(new Ocean())
      );
      const addedWorlds = [];

      if (worlds) {
        worlds.forEach((child) => {
          this.setChild(child);
          addedWorlds.push(child.name);
        });
      }

      addedResources.forEach(({ resource }) => this.deck.remove(resource));
      this.grid.addTiles(grid.tiles);
      this.isExplored = this.checkIfExplored();

      if (this.isExplored && player && !player.hasExploredFirstIsland) {
        player.hasExploredFirstIsland = true;
      }

      return {
        tiles: grid.getTiles(),
        worlds: addedWorlds,
        isExplored: this.isExplored,
      };
    }

    throw new Error(`
      Cannot explore: Position (${position.q}, ${position.r}) is not unexplored
    `);
  }

  exploreWhile(shouldExplore) {
    const unexploredTiles = this.grid.filter(tile => tile.resource.equals(new Unexplored()));

    if (unexploredTiles.size > 0) {
      const randomOrder = unexploredTiles.tiles.toList().sortBy(Math.random);
      const didExplore = randomOrder.some(({ position }) => {
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

  checkIfExplored() {
    return this.isExplored;
  }
}
