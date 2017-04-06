import WorldNode from './';
import IslandTerraformer from './terraformer/island-terraformer.js';
import Position from './position.js';
import Tile from './tile.js';
import Unexplored from './resources/unexplored.js';

export default class IslandNode extends WorldNode {
  constructor(deck) {
    super(deck, IslandTerraformer);

    const startResource = deck.pick();
    const origo = new Position(0, 0);

    deck.remove(startResource);
    this.grid.addTile(new Tile(origo, startResource));
    this.grid.populateUndefinedNeighbours(origo, new Unexplored());
  }
}
