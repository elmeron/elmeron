export default class Refinery {
  constructor(grid, now) {
    this.delta = 0.1 * grid.size;
    this.grid = grid.map((tile) => {
      const t = tile;
      t.resource.setDelta(this.delta, now);
      t.owner = this;
      return t;
    });
  }

  getData() {
    return {
      type: 'Refinery',
      delta: this.delta,
    };
  }

  static getPrice(tiles) {
    return tiles.length;
  }
}
