import Deck from '../deck.js';
import ResourceDistribution from '../resource-distribution.js';
import Resource from '../resource.js';

test('picking should decrease size', () => {
  const dist = new ResourceDistribution();
  const forest = new Resource('forest');
  dist.set(forest, 10);
  const deck = new Deck(dist);

  expect(deck.size).toBe(10);
  expect(deck.pickAndRemove()).toBe(forest);
  expect(deck.size).toBe(9);
});

test('should be empty in the beginning', () => {
  const deck = new Deck(new ResourceDistribution());

  expect(deck.isEmpty()).toBeTruthy();
});
