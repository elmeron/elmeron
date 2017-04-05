/**
 * World Model entry point.
 */

import TileHexagonGrid from './tile-hexagon-grid.js';
import Deck from './deck.js';
import { generateWorldName } from '../rand-util.js';

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
}
