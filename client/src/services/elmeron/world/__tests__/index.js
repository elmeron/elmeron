import WorldNode from '../';
import Tile from '../tile.js';
import Position from '../position.js';

describe('world node', () => {
  test('name', () => {
    const world = new WorldNode('name');
    expect(world.name).toBe('name');
  });

  test('children', () => {
    const parent = new WorldNode('parent');
    const child = new WorldNode('child');

    parent.addChild(child);

    expect(parent.children.size).toBe(1);
    expect(child.parent).toBe(parent);
  });
});

describe('tiles', () => {
  const parent = new WorldNode('parent');
  const child = new WorldNode('child');
  const origo = new Position(0, 0);
  const tile = new Tile(origo, undefined, child);

  parent.addChild(child);
  parent.addTile(tile);

  test('is in parent list', () => {
    expect(parent.tiles.size).toBe(1);
  });

  test('has correct owner', () => {
    expect(tile.owner).toBe(child);
  });
});
