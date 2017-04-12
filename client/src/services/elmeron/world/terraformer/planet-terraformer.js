import Terraformer from './terraformer.js';
import StartIslandExplorationHandler from './start-island-exploration-handler.js';
import ExpandIslandHandler from './expand-island-handler.js';
import FinishIslandExplorationHandler from './finish-island-exploration-handler.js';
import PlanetOceanHandler from './planet-ocean-handler.js';

class PlanetTerraformer extends Terraformer {
  constructor() {
    super([
      new StartIslandExplorationHandler(),
      new ExpandIslandHandler(),
      new FinishIslandExplorationHandler(),
      new PlanetOceanHandler(),
    ]);
  }
}

export default new PlanetTerraformer();
