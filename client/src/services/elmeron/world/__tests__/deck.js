import Deck from '../deck.js';
import ResourceDistribution from '../resource-distribution.js';
import Resource from '../resource.js';

test('picking should decrease size', () => {
  const dist = new ResourceDistribution();
  const forest = new Resource('forest');
  dist.set(forest, 10);
  const deck = new Deck(dist);

  expect(deck.size).toBe(10);
  expect(deck.pick()).toBe(forest);
  expect(deck.size).toBe(9);
});
