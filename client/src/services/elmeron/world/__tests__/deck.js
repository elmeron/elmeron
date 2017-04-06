import Deck from '../deck.js';
import ResourceDistribution from '../resource-distribution.js';
import Resource from '../resource.js';

test('picking should decrease size', () => {
  const dist = new ResourceDistribution();
  const forest = new Resource('forest');
  dist.set(forest, 10);
  const deck = new Deck(dist);
  const pickedResource = deck.pick();

  expect(deck.size).toBe(10);
  expect(pickedResource).toBe(forest);

  deck.remove(pickedResource);

  expect(deck.size).toBe(9);
});

test('should be empty in the beginning', () => {
  const deck = new Deck(new ResourceDistribution());

  expect(deck.isEmpty()).toBeTruthy();
});

test('redistribute', () => {
  const firstDist = new ResourceDistribution();
  const secondDist = new ResourceDistribution();
  const forest = new Resource('Forest');
  const rock = new Resource('Rock');

  firstDist.set(forest, 10);

  let deck = new Deck(firstDist);
  let redistDeck = deck.redistribute(secondDist);

  expect(redistDeck.distribution.count(forest)).toBe(10);

  firstDist.set(rock, 5);
  secondDist.set(forest, 5);
  secondDist.set(rock, 1);

  deck = new Deck(firstDist);
  redistDeck = deck.redistribute(secondDist);

  expect(redistDeck.distribution.count(forest)).toBe(218);
  expect(redistDeck.distribution.count(rock)).toBe(6);

  firstDist.set(forest, 9);
  secondDist.set(forest, 1);

  deck = new Deck(firstDist);
  redistDeck = deck.redistribute(secondDist);

  expect(redistDeck.distribution.count(forest)).toBe(14);
});
