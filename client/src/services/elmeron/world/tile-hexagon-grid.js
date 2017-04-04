import { Map, List } from 'immutable';
import Position from './position.js';
import Tile from './tile.js';

export default class TileHexagonGrid {
  constructor() {
    this.tiles = new Map();
  }

  addTile(tile) {
    const id = tile.getId();
    this.tiles = this.tiles.set(id, tile);
  }

  addTiles(tiles) {
    const newTiles = tiles.reduce((result, tile) => {
      const id = tile.getId();
      return result.set(id, tile);
    }, new Map());
    this.tiles = this.tiles.mergeWith((oldVal, newVal) => newVal, newTiles);
  }

  getTile(position) {
    const id = position.getId();
    return this.tiles.get(id);
  }

  getTiles() {
    return this.tiles.reduce((result, tile, key) =>
      result.push(tile.getData())
    , new List()).toJS();
  }

  populateUndefinedNeighbours(position, resource) {
    const { q, r } = position;
    const neighbours = [
      new Position(q, r - 1),
      new Position(q + 1, r - 1),
      new Position(q + 1, r),
      new Position(q, r + 1),
      new Position(q - 1, r + 1),
      new Position(q - 1, r),
    ];

    neighbours.forEach((neighbour) => {
      const positionId = neighbour.getId();

      if (this.tiles.has(positionId)) {
        return;
      }

      const tile = new Tile(neighbour, resource);
      this.addTile(tile);
    });
  }
}
