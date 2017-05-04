import IslandTileHandler from '../island-tile-handler.js';
import ResourceDistribution from '../../resource-distribution.js';
import Deck from '../../deck.js';
import CountableResource from '../../countable-resource.js';
import Position from '../../position.js';
import IslandNode from '../../island-node.js';

test('make tiles', () => {
  const distribution = new ResourceDistribution();
  const forest = new CountableResource('Forest', 0, 1);

  distribution.set(forest, 10);

  const deck = new Deck(distribution);
  const node = new IslandNode(deck);
  const terraformer = IslandTileHandler;

  terraformer.makeTiles(new Position(0, 1), node);
});
