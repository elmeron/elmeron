export default class TerraformHandler {
  constructor() {
    this.successor = undefined;
  }

  setSuccessor(successor) {
    this.successor = successor;
  }

  handle(...args) {
    if (this.constructor.canHandle(...args)) {
      return this.constructor.makeTiles(...args);
    }
    return this.successor.handle(...args);
  }

  static canHandle() {}

  static makeTiles() {}
}
