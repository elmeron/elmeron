import { Set } from 'immutable';
import config from '../../config.js';

export function hexToPixel(q, r) {
  const { size, spacing } = config.tiles;
  const width = (size + spacing) * 2;
  const height = (Math.sqrt(3) / 2) * width;
  const horiz = width * (3 / 4);
  const vert = height;

  return {
    x: horiz * q,
    y: vert * (r + (q / 2)),
  };
}

function getNeighbourPositions(position) {
  const { q, r } = position;

  return [
    { q, r: r - 1 },
    { q: q + 1, r: r - 1 },
    { q: q + 1, r },
    { q, r: r + 1 },
    { q: q - 1, r: r + 1 },
    { q: q - 1, r },
  ];
}

export function getDefinedNeighbours(position, tiles, ignore = () => {}) {
  return getNeighbourPositions(position).reduce((result, { q, r }) => {
    const tile = tiles.find(t => t.q === q && t.r === r);

    if (tile && !ignore(tile)) {
      return result.add(tile);
    }

    return result;
  }, new Set());
}

export function getSurroundingTiles(selectedTiles, allTiles, ignore = () => {}) {
  return selectedTiles.reduce((result, selectedTile) => {
    const neighbours = getDefinedNeighbours(selectedTile, allTiles, (tile) => {
      const alreadySelected = selectedTiles.some(t => t.q === tile.q && t.r === tile.r);

      return ignore(tile) || alreadySelected;
    });

    return result.concat(neighbours);
  }, new Set());
}

export function tilesAreConnected(tiles) {
  const transformed = tiles.map(tile => ({
    q: tile.q,
    r: tile.r,
    visited: false,
  }));

  function visit(current, all) {
    const c = current;
    c.visited = true;

    getDefinedNeighbours(current, all).forEach((neighbour) => {
      if (!neighbour.visited) {
        visit(neighbour, all);
      }
    });
  }

  visit(transformed.first(), transformed);
  return transformed.every(tile => tile.visited);
}
