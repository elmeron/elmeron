export default class TerraformHandler {
  constructor() {
    this.successor = undefined;
  }

  setSuccessor(successor) {
    this.successor = successor;
  }

  handle(position, node) {
    if (this.constructor.canHandle(position, node)) {
      return this.constructor.makeTiles(position, node);
    }
    return this.successor.handle(position, node);
  }

  static canHandle() {}

  static makeTiles() {}
}
