import WorldNode from './';
import PlanetTerraformer from './terraformer/planet-terraformer.js';
import Position from './position.js';
import Tile from './tile.js';
import Unexplored from './resources/unexplored.js';
import Ocean from './resources/ocean.js';

export default class PlanetNode extends WorldNode {
  constructor(deck, name) {
    super(deck, PlanetTerraformer, name);

    const startResource = deck.pick();
    const origo = new Position(0, 0);
    const unexploredNeighbours = this.grid.populateUndefinedNeighbours(origo, new Unexplored());
    const tempIsland = new WorldNode();

    this.setChild(tempIsland);
    this.deck.remove(startResource);
    this.grid.addTile(new Tile(origo, startResource, tempIsland.name));
    this.grid.addTiles(unexploredNeighbours.tiles);

    this.exploreWhile((neighbours) => {
      const islandNeighbours = neighbours.filter(tile =>
        !tile.resource.equals(new Unexplored()) && !tile.resource.equals(new Ocean())
      );

      return islandNeighbours.size > 0;
    });
  }
}
