import CountableResource from '../countable-resource.js';
import ResourceDistribution from '../resource-distribution.js';
import Deck from '../deck.js';
import IslandNode from '../island-node.js';

test('constructor', () => {
  const distribution = new ResourceDistribution();
  const resource = new CountableResource('Resource', 0, 1);

  distribution.set(resource, 10);

  const deck = new Deck(distribution);
  const island = new IslandNode(deck);

  expect(island.grid.size).toBe(7);
});

test('explore until', () => {
  const distribution = new ResourceDistribution();
  const resource = new CountableResource('Resource', 0, 1);

  distribution.set(resource, 1);

  const deck = new Deck(distribution);
  const island = new IslandNode(deck);

  island.exploreWhile(() => true);

  expect(island.grid.size).toBeGreaterThan(0);
});
