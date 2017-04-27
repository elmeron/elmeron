import WorldNode from './';
import SpaceTerraformer from './terraformer/space-terraformer.js';
import Position from './position.js';
import Unexplored from './resources/unexplored.js';
import Void from './resources/void.js';
import ElmeronResource from './resources/elmeron.js';
import SpaceDeck from './space-deck.js';
import Tile from './tile.js';

export default class SpaceNode extends WorldNode {
  constructor(onElmeronFound) {
    super(new SpaceDeck(), SpaceTerraformer, 'space', 100);
    this.onElmeronFound = onElmeronFound;
    let startResource = new ElmeronResource();

    while (startResource.equals(new ElmeronResource())) {
      startResource = this.deck.pick();
    }

    const origo = new Position(0, 0);
    const unexploredNeighbours = this.grid.populateUndefinedNeighbours(origo, new Unexplored());
    const tempPlanet = new WorldNode();

    this.grid.addTile(new Tile(origo, startResource, tempPlanet.name));
    this.grid.addTiles(unexploredNeighbours.tiles);

    this.exploreWhile((neighbours) => {
      const islandNeighbours = neighbours.filter(tile =>
        !tile.resource.equals(new Unexplored()) && !tile.resource.equals(new Void())
      );

      return islandNeighbours.size > 0;
    });
  }

  explore(position) {
    const { tiles, worlds } = super.explore(position);
    const elmeronResourceName = new ElmeronResource().name;
    const elmeronTile = tiles.find(tile =>
      tile.resource.name === elmeronResourceName
    );

    if (elmeronTile) {
      this.onElmeronFound(elmeronTile);
    }

    return { tiles, worlds };
  }
}
