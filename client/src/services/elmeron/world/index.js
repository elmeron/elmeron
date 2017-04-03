/**
 * World Model entry point.
 */

import { Map } from 'immutable';

export default class WorldNode {
  constructor(name, deck, level = 0) {
    this.name = name;
    this.deck = deck;
    this.level = level;
    this.children = new Map();
    this.tiles = new Map();
  }

  addChild(child) {
    const c = child;
    const name = c.name;

    c.parent = this;
    this.children = this.children.set(name, c);
  }

  getChild(name) {
    return this.children.get(name);
  }

  hasChildName(name) {
    return this.children.has(name);
  }

  addTile(tile) {
    const id = tile.getId();
    this.tiles = this.tiles.set(id, tile);
  }

  getTile(position) {
    return this.tiles.get(position.getId());
  }
}
