import Resource from '../resource.js';
import ResourceDistribution from '../resource-distribution.js';
import Deck from '../deck.js';
import IslandNode from '../island-node.js';

test('constructor', () => {
  const distribution = new ResourceDistribution();
  const resource = new Resource('Resource');

  distribution.set(resource, 10);

  const deck = new Deck(distribution);
  const island = new IslandNode(deck);

  expect(island.grid.size).toBe(7);
  expect(island.name).toBeDefined();
});

