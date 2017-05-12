export default class Tile {
  constructor(position, resource, owner, player) {
    this.position = position;
    this.resource = resource;
    this.owner = owner;
    this.player = player;
  }

  getId() {
    return this.position.getId();
  }

  getData() {
    let owner = this.owner;
    const nickname = this.player && this.player.nickname;

    if (this.owner && this.owner.getData) {
      owner = this.owner.getData();
    }

    return {
      q: this.position.q,
      r: this.position.r,
      resource: this.resource.getData(),
      owner,
      player: nickname,
    };
  }

  clone() {
    const resource = this.resource.clone();
    const owner = this.owner && this.owner.clone ? this.owner.clone() : this.owner;

    return new Tile(this.position, resource, owner, this.player);
  }
}
