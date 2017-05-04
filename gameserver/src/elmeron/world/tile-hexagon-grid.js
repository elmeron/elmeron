import { Map, List } from 'immutable';
import Position from './position.js';
import Tile from './tile.js';
import Unexplored from './resources/unexplored.js';
import ResourceDistribution from './resource-distribution.js';

function getNeighbourPositions(position) {
  const { q, r } = position;

  return [
    new Position(q, r - 1),
    new Position(q + 1, r - 1),
    new Position(q + 1, r),
    new Position(q, r + 1),
    new Position(q - 1, r + 1),
    new Position(q - 1, r),
  ];
}

export default class TileHexagonGrid {
  constructor() {
    this.tiles = new Map();
    this.size = this.tiles.size;
    this.extremes = {
      qMin: Number.POSITIVE_INFINITY,
      qMax: Number.NEGATIVE_INFINITY,
      rMin: Number.POSITIVE_INFINITY,
      rMax: Number.NEGATIVE_INFINITY,
    };
  }

  updateExtremes(position) {
    const { q, r } = position;
    const { qMin, qMax, rMin, rMax } = this.extremes;

    this.extremes.qMin = Math.min(qMin, q);
    this.extremes.qMax = Math.max(qMax, q);
    this.extremes.rMin = Math.min(rMin, r);
    this.extremes.rMax = Math.max(rMax, r);
  }

  addTile(tile) {
    const id = tile.getId();
    this.tiles = this.tiles.set(id, tile);
    this.size = this.tiles.size;
    this.updateExtremes(tile.position);
  }

  addTiles(tiles) {
    const newTiles = tiles.reduce((result, tile) => {
      const id = tile.getId();
      this.updateExtremes(tile.position);
      return result.set(id, tile);
    }, new Map());
    this.tiles = this.tiles.mergeWith((oldVal, newVal) => newVal, newTiles);
    this.size = this.tiles.size;
  }

  getTile(position) {
    const id = position.getId();
    return this.tiles.get(id).clone();
  }

  getTiles(positions = false) {
    if (positions) {
      const grid = new TileHexagonGrid();

      positions.forEach(({ q, r }) => {
        const tile = this.getTile(new Position(q, r));
        grid.addTile(tile);
      });

      return grid;
    }

    return this.tiles.reduce((result, tile) =>
      result.push(tile.getData())
    , new List()).toJS();
  }

  filter(predicate) {
    const grid = new TileHexagonGrid();
    const filteredTiles = this.tiles.filter(predicate);
    grid.addTiles(filteredTiles);

    return grid;
  }

  filterOut(resources) {
    const filteredTiles = this.tiles.filterNot(({ resource }) =>
      resources.some(ignore => resource.equals(ignore))
    );
    const grid = new TileHexagonGrid();

    grid.addTiles(filteredTiles);
    return grid;
  }

  every(predicate) {
    return this.tiles.every(predicate);
  }

  some(predicate) {
    return this.tiles.some(predicate);
  }

  map(sideEffect) {
    const grid = new TileHexagonGrid();
    grid.addTiles(this.tiles.map(sideEffect));
    return grid;
  }

  forEach(sideEffect) {
    return this.tiles.forEach(sideEffect);
  }

  min(predicate) {
    return this.tiles.minBy(predicate);
  }

  isUnexploredTile(position) {
    const tile = this.getTile(position);
    return tile && tile.resource.equals(new Unexplored());
  }

  populateUndefinedNeighbours(position, resource) {
    const returnGrid = new TileHexagonGrid();

    getNeighbourPositions(position).forEach((neighbour) => {
      const positionId = neighbour.getId();

      if (this.tiles.has(positionId)) {
        return;
      }

      returnGrid.addTile(new Tile(neighbour, resource));
    });

    return returnGrid;
  }

  getDefinedNeighbours(position, ignore = []) {
    const returnGrid = new TileHexagonGrid();

    getNeighbourPositions(position).forEach((neighbour) => {
      const positionId = neighbour.getId();

      if (this.tiles.has(positionId)) {
        const tile = this.getTile(neighbour);
        const inIgnoreList = ignore.some(res => tile.resource.equals(res));

        if (inIgnoreList) {
          return;
        }

        returnGrid.addTile(tile);
      }
    });

    return returnGrid;
  }

  getSurroundingTiles(grid) {
    const returnGrid = new TileHexagonGrid();

    grid.tiles.forEach(({ position }) => {
      const neighbours = this.getDefinedNeighbours(position).filter(tile =>
        grid.tiles.every(gridTile => tile.position !== gridTile.position)
      );

      returnGrid.addTiles(neighbours.tiles);
    });

    return returnGrid;
  }

  toResourceDistribution() {
    const distribution = new ResourceDistribution();

    this.tiles.forEach((tile) => {
      const resource = tile.resource;
      const amount = distribution.count(resource);

      distribution.set(resource, amount + 1);
    });

    return distribution;
  }

  getDistanceToRelativeOrigo(position) {
    const { q, r } = position;
    const { qMin, qMax, rMin, rMax } = this.extremes;
    const qO = qMin + (Math.abs(qMax - qMin) / 2);
    const rO = rMin + (Math.abs(rMax - rMin) / 2);

    return (Math.abs(qO - q) + Math.abs((qO + rO) - (q + r)) + Math.abs(rO - r)) / 2;
  }
}
