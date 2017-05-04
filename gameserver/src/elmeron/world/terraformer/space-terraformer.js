import Terraformer from './terraformer.js';
import StartPlanetExplorationHandler from './start-planet-exploration-handler.js';
import FinishPlanetExplorationHandler from './finish-planet-exploration-handler.js';
import SpaceVoidHandler from './space-void-handler.js';

class SpaceTerraformer extends Terraformer {
  constructor() {
    super([
      new StartPlanetExplorationHandler(),
      new FinishPlanetExplorationHandler(),
      new SpaceVoidHandler(),
    ]);
  }
}

export default new SpaceTerraformer();
