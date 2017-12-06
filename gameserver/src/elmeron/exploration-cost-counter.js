import SpaceNode from './world/space-node.js';
import PlanetNode from './world/planet-node.js';
import IslandNode from './world/island-node.js';

export default class ExplorationCostCounter {
  constructor() {
    this.spaceCount = 0;
    this.planetCount = 0;
    this.islandCount = 1;
  }

  increaseCount(node) {
    const type = node.getNodeType();

    if (type === 'IslandNode') {
      ++this.islandCount;
    } else if (type === 'PlanetNode') {
      ++this.planetCount;
    } else if (type === 'SpaceNode') {
      ++this.spaceCount;
    } else {
      throw new Error(`Cannot increase tile count: unknown node type '${type}'`);
    }
  }

  getExplorationCost() {
    return this.spaceCount * SpaceNode.explorationCost +
      this.planetCount * PlanetNode.explorationCost +
      this.islandCount * IslandNode.explorationCost;
  }
}
