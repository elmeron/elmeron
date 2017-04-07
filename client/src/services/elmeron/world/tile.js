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
    return {
      q: this.position.q,
      r: this.position.r,
      resource: this.resource.name,
      owner: this.owner,
    };
  }
}
