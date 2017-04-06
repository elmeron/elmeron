import Terraformer from './terraformer.js';
import IslandOceanHandler from './island-ocean-handler.js';
import IslandTileHandler from './island-tile-handler.js';

class IslandTerraformer extends Terraformer {
  constructor() {
    super([
      new IslandOceanHandler(),
      new IslandTileHandler(),
    ]);
  }
}

export default new IslandTerraformer();
