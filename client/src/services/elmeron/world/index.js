/**
 * World Model entry point.
 */

import TileHexagonGrid from './tile-hexagon-grid.js';
import { generateWorldName } from '../rand-util.js';

export default class WorldNode {
  constructor(deck, terraformer, name = generateWorldName()) {
    this.deck = deck;
    this.terraformer = terraformer;
    this.name = name;
    this.grid = new TileHexagonGrid();
  }
}
