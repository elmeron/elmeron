class Time {
  constructor() {
    this.offset = 0;
  }

  setOffset(offset) {
    this.offset = offset;
  }

  now() {
    return Date.now() - this.offset;
  }
}

export default new Time();
