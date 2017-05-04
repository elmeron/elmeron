import LogarithmicDistribution from '../logarithmic-distribution.js';
import ResourceDistribution from '../resource-distribution.js';
import Resource from '../resource.js';

test('constructor', () => {
  const forest = new Resource('Forest');
  const rock = new Resource('Rock');
  const sand = new Resource('Sand');
  const resources = [forest, rock, sand];
  const size = 10;
  const biase = new ResourceDistribution();

  biase.set(forest, 2);
  biase.set(rock, 1);

  const dist = new LogarithmicDistribution(resources, biase, size);

  expect(dist.count(forest)).toBe(5);
  expect(dist.count(rock)).toBe(3);
});
