export default class Refinery {
  constructor(grid, now, onDeltaChange = () => {}) {
    this.delta = Refinery.calculateDelta(grid);
    this.grid = grid.map((tile) => {
      const t = tile;
      t.resource.deltaAmount.delta = -this.delta;
      t.resource.deltaAmount.deltaStart = now;
      t.owner = this;
      return t;
    });
    this.onDeltaChange = onDeltaChange;
    this.startDeltaChangeTimer();
  }

  getData() {
    return {
      type: 'Refinery',
      delta: this.delta,
    };
  }

  getTileWithSmallestOffset() {
    const grid = this.grid.filter(tile => tile.resource.deltaAmount.offset > 0);

    return grid.min(tile => tile.resource.deltaAmount.offset);
  }

  static calculateTimeToDeltaChange(minTile) {
    const timeToZero = minTile.resource.deltaAmount.getTimeTo(0);
    const timeUnit = minTile.resource.deltaAmount.timeUnit;

    return timeToZero * timeUnit;
  }

  startDeltaChangeTimer() {
    const minOffsetTile = this.getTileWithSmallestOffset();

    if (minOffsetTile) {
      const timeToZero = Refinery.calculateTimeToDeltaChange(minOffsetTile);
      const deltaChange = -1;

      setTimeout(() => {
        this.delta = this.delta + deltaChange;
        this.addDelta(deltaChange, Date.now());
        this.onDeltaChange(deltaChange, this.grid);
      }, timeToZero);
    }
  }

  addDelta(value, now) {
    this.grid = this.grid.map((tile) => {
      const t = tile;
      const delta = t.resource.deltaAmount.delta;

      t.resource.setDelta(delta - value, now);

      return t;
    });
  }

  static calculateDelta(grid) {
    return grid.size;
  }

  static getPrice(tiles) {
    return tiles.length;
  }
}
