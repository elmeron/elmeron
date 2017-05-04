import ResourceDistribution from '../resource-distribution';
import Resource from '../resource';

test('set value', () => {
  const dist = new ResourceDistribution();
  const resource = new Resource('forest');

  dist.set(resource, 10);

  expect(dist.count(resource)).toBe(10);
  expect(dist.size).toBe(10);
});

test('count', () => {
  const dist = new ResourceDistribution();
  const resource = new Resource('forest');

  expect(dist.count(resource)).toBe(0);
});

test('max', () => {
  const dist = new ResourceDistribution();
  const forest = new Resource('Forest');
  const rock = new Resource('Rock');

  dist.set(forest, 5);
  dist.set(rock, 10);

  expect(dist.max()).toEqual(rock);
});

test('get index', () => {
  const dist = new ResourceDistribution();
  const forest = new Resource('forest');

  dist.set(forest, 10);

  expect(dist.get(0)).toEqual(forest);
  expect(dist.get(10)).not.toBeDefined();
});
