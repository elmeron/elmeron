import Resource from '../resource.js';
import ResourceDistribution from '../resource-distribution.js';
import Deck from '../deck.js';
import IslandNode from '../island-node.js';
import Position from '../position.js';
import Ocean from '../resources/ocean.js';

test('constructor', () => {
  const distribution = new ResourceDistribution();
  const resource = new Resource('Resource');

  distribution.set(resource, 10);

  const deck = new Deck(distribution);
  const island = new IslandNode(deck);

  expect(island.grid.size).toBe(7);
  expect(island.name).toBeDefined();
});

test('explore empty deck', () => {
  const distribution = new ResourceDistribution();
  const resource = new Resource('Resource');

  distribution.set(resource, 1);

  const deck = new Deck(distribution);
  const island = new IslandNode(deck);
  const explorePosition = new Position(1, 0);
  const exploredTiles = island.explore(explorePosition);

  expect(island.grid.size).toBe(7);
  expect(island.grid.getTile(explorePosition).resource.name).toBe(new Ocean().name);
  expect(exploredTiles[0].resource).toBe(new Ocean().name);
});
