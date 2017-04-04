/**
 * World Model entry point.
 */

import TileHexagonGrid from './tile-hexagon-grid.js';

export default class WorldNode {
  constructor(deck, terraformer, name = this.createName()) {
    this.deck = deck;
    this.terraformer = terraformer;
    this.name = name;
    this.grid = new TileHexagonGrid();
  }

  createName() {
    return 'World Name';
  }
}
