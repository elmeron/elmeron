import WorldNode from './';
import PlanetTerraformer from './terraformer/planet-terraformer.js';
import Position from './position.js';
import Tile from './tile.js';
import Unexplored from './resources/unexplored.js';
import Ocean from './resources/ocean.js';

export default class PlanetNode extends WorldNode {
  constructor(deck, name) {
    super(deck, PlanetTerraformer, name);

    const origo = new Position(0, 0);
    this.grid.addTile(new Tile(origo, new Unexplored()));
  }

  checkIfExplored() {
    const allIslandsAreExplored = this.grid
      .filterOut([new Unexplored(), new Ocean()])
      .every(tile =>
        this.children.has(tile.owner)
      );

    return this.deck.size === 0 && allIslandsAreExplored;
  }

  populate(maxIslands) {
    this.exploreWhile((neighbours) => {
      if (this.children.size < maxIslands) {
        const unknownIslands = this.grid
          .filterOut([new Unexplored(), new Ocean()])
          .filter(tile => !this.children.has(tile.owner));

        if (unknownIslands.size > 0) {
          return neighbours.some(neighbour =>
            unknownIslands.some(island =>
              neighbour.position.equals(island.position)
            )
          );
        }

        return this.deck.size > 0;
      }

      return false;
    });

    return this.children.size;
  }

  getExplorationCost() {
    return PlanetNode.explorationCost;
  }
}

PlanetNode.explorationCost = 10;
