import Chance from 'chance';
import WorldNode from './';
import SpaceTerraformer from './terraformer/space-terraformer.js';
import Position from './position.js';
import Unexplored from './resources/unexplored.js';
import Void from './resources/void.js';
import ElmeronResource from './resources/elmeron.js';
import SpaceDeck from './space-deck.js';
import Tile from './tile.js';

const chance = new Chance();

export default class SpaceNode extends WorldNode {
  constructor() {
    super(new SpaceDeck(), SpaceTerraformer, 'Space', 100);
    let startResource = new ElmeronResource();

    while (startResource.equals(new ElmeronResource())) {
      startResource = this.deck.pick();
    }

    const origo = new Position(0, 0);
    this.grid.addTile(new Tile(origo, new Unexplored()));
  }

  explore(position) {
    const { tiles, worlds } = super.explore(position);
    const elmeronResourceName = new ElmeronResource().name;
    const elmeronTile = tiles.find(tile =>
      tile.resource.name === elmeronResourceName
    );

    if (elmeronTile) {
      this.emit('elmeronFound', elmeronTile);
    }

    return { tiles, worlds };
  }

  populate(maxIslands) {
    const minIslandsPerPlanet = 1;
    const maxIslandsPerPlanet = 5;
    let currentIslandAmount = 0;

    this.exploreWhile((neighbours) => {
      // make sure each planet is populated
      this.children.forEach((planet) => {
        if (planet.children.size === 0) {
          const remaining = maxIslands - currentIslandAmount;
          const islandsPerPlanet = Math.min(remaining, chance.integer({
            min: minIslandsPerPlanet,
            max: maxIslandsPerPlanet,
          }));
          currentIslandAmount += planet.populate(islandsPerPlanet);
        }
      });

      if (currentIslandAmount < maxIslands) {
        const unknownPlanets = this.grid
          .filterOut([new Unexplored(), new Void()])
          .filter(tile => !this.children.has(tile.owner));

        if (unknownPlanets.size > 0) {
          return neighbours.some(neighbour =>
            unknownPlanets.some(planet =>
              neighbour.position.equals(planet.position)
            )
          );
        }

        return this.deck.size > 0;
      }
    });

    return currentIslandAmount;
  }
}
