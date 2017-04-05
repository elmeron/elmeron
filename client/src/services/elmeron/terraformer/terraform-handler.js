export default class TerraformHandler {
  constructor() {
    this.successor = undefined;
  }

  setSuccessor(successor) {
    this.successor = successor;
  }

  handle(position, location, game) {
    if (this.canHandle(position, location, game)) {
      return this.makeTiles(position, location, game);
    }
    return this.successor.handle(position, location, game);
  }
}
