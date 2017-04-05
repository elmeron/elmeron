export default class Terraformer {
  constructor(handlers) {
    if (!handlers) {
      throw new Error('cannot create terraformer: no handlers defined');
    }
    this.setTerraformHandlers(handlers);
  }

  setTerraformHandlers(handlers) {
    this.handlers = handlers;
    this.handlers.forEach((handler, index) => {
      const next = index + 1;
      if (next < this.handlers.length) {
        handler.setSuccessor(this.handlers[next]);
      }
    });
  }

  makeTiles(position, location, game) {
    return this.handlers[0].handle(position, location, game);
  }
}
