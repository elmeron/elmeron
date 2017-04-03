export default class Tile {
  constructor(position, resource, owner) {
    this.position = position;
    this.resource = resource;
    this.owner = owner;
  }

  getId() {
    return this.position.getId();
  }
}
