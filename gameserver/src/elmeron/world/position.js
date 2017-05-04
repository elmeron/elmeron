export default class Position {
  constructor(q, r) {
    this.q = q;
    this.r = r;
  }

  getId() {
    return JSON.stringify({
      q: this.q,
      r: this.r,
    });
  }

  getData() {
    return {
      q: this.q,
      r: this.r,
    };
  }
}
