import WorldNode from './';
import Position from './position.js';
import Resource from './resource.js';
import Tile from './tile.js';
import Ocean from './resources/ocean.js';
import Unexplored from './resources/unexplored.js';
import TileHexagonGrid from './tile-hexagon-grid.js';

export default class IslandNode extends WorldNode {
  constructor(deck) {
    super(deck);

    const startResource = deck.pickAndRemove();
    const unexplored = new Resource('Unexplored');
    const origo = new Position(0, 0);

    this.grid.addTile(new Tile(origo, startResource));
    this.grid.populateUndefinedNeighbours(origo, unexplored);
  }

  explore(position) {
    if (this.grid.isUnexploredTile(position)) {
      let resource;
      let result;

      if (this.deck.isEmpty()) {
        resource = new Ocean();
        result = new TileHexagonGrid();
      } else {
        resource = this.deck.pickAndRemove();
        result = this.grid.populateUndefinedNeighbours(position, new Unexplored());
      }

      this.grid.addTile(new Tile(position, resource));
      result.addTile(new Tile(position, resource));

      return result.getTiles();
    }

    throw new Error(`
      Cannot explore: Position (${position.q}, ${position.r}) is not unexplored
    `);
  }
}
