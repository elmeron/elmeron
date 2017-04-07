import Terraformer from './terraformer.js';
import StartWorldExplorationHandler from './start-world-exploration-handler.js';
import ExpandWorldHandler from './expand-world-handler.js';
import FinishWorldExplorationHandler from './finish-world-exploration-handler.js';
import PlanetOceanHandler from './planet-ocean-handler.js';

class PlanetTerraformer extends Terraformer {
  constructor() {
    super([
      new StartWorldExplorationHandler(),
      new ExpandWorldHandler(),
      new FinishWorldExplorationHandler(),
      new PlanetOceanHandler(),
    ]);
  }
}

export default new PlanetTerraformer();
