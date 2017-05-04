export default class Tile {
  constructor(position, resource, owner) {
    this.position = position;
    this.resource = resource;
    this.owner = owner;
  }

  getId() {
    return this.position.getId();
  }

  getData() {
    let owner = this.owner;

    if (this.owner && this.owner.getData) {
      owner = this.owner.getData();
    }

    return {
      q: this.position.q,
      r: this.position.r,
      resource: this.resource.getData(),
      owner,
    };
  }

  clone() {
    const resource = this.resource.clone();
    const owner = this.owner && this.owner.clone ? this.owner.clone() : this.owner;

    return new Tile(this.position, resource, owner);
  }
}
