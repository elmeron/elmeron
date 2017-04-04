import WorldNode from './';
import Position from './position.js';
import Resource from './resource.js';
import Tile from './tile.js';

export default class IslandNode extends WorldNode {
  constructor(deck) {
    super(deck);

    const startResource = deck.pickAndRemove();
    const unexplored = new Resource('Unexplored');
    const origo = new Position(0, 0);

    this.grid.addTile(new Tile(origo, startResource));
    this.grid.populateUndefinedNeighbours(origo, unexplored);
  }
}
