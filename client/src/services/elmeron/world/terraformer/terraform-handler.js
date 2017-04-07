export default class TerraformHandler {
  constructor() {
    this.successor = undefined;
  }

  setSuccessor(successor) {
    this.successor = successor;
  }

  handle(position, node, neighbours) {
    if (this.constructor.canHandle(position, node, neighbours)) {
      return this.constructor.makeTiles(position, node, neighbours);
    }
    return this.successor.handle(position, node, neighbours);
  }

  static canHandle() {}

  static makeTiles() {}
}
