export default class Refinery {
  constructor(grid, now, onDeltaChange = () => {}) {
    this.delta = Refinery.calculateDelta(grid);
    this.grid = grid.map((tile) => {
      const t = tile;
      t.resource.deltaAmount.delta = -1;
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

    return (timeToZero * timeUnit);
  }

  startDeltaChangeTimer() {
    const minOffsetTile = this.getTileWithSmallestOffset();

    if (minOffsetTile) {
      const timeToZero = Refinery.calculateTimeToDeltaChange(minOffsetTile);

      setTimeout(() => {
        minOffsetTile.resource.deltaAmount.zerofy();
        this.grid.addTile(minOffsetTile);

        const deltaChange = Refinery.calculateDelta(this.grid) - this.delta;

        this.delta += deltaChange;
        this.onDeltaChange(deltaChange, this.grid);
        this.startDeltaChangeTimer();
      }, timeToZero);
    }
  }

  static calculateDelta(grid) {
    return grid.tiles.count(tile => tile.resource.deltaAmount.offset > 0);
  }

  static getPrice(tiles) {
    return tiles.length;
  }
}
