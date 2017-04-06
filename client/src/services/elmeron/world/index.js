/**
 * World Model entry point.
 */

import TileHexagonGrid from './tile-hexagon-grid.js';
import Deck from './deck.js';

export function generateWorldName() {
  return 'World Name';
}

export default class WorldNode {
  constructor(deck = new Deck(), terraformer, name = generateWorldName()) {
    if (deck.isEmpty()) {
      throw new Error('Cannot create world node: deck is empty');
    }

    this.deck = deck;
    this.terraformer = terraformer;
    this.name = name;
    this.grid = new TileHexagonGrid();
  }

  explore(position) {
    if (this.deck.isEmpty()) {
      throw new Error('Cannot explore: deck is empty');
    }

    if (this.grid.isUnexploredTile(position)) {
      return this.terraformer.makeTiles(position, this).getTiles();
    }

    throw new Error(`
      Cannot explore: Position (${position.q}, ${position.r}) is not unexplored
    `);
  }
}
