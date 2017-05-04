import GemInventory from '../gem-inventory.js';
import Resource from '../world/resource.js';

test('add resource', () => {
  const forest = new Resource('Forest');
  const rock = new Resource('Rock');
  const inventory = new GemInventory();

  inventory.add(forest, 1);
  inventory.add(rock, 2);

  expect(inventory.count(forest)).toEqual(1);
  expect(inventory.count(rock)).toEqual(2);
});

test('get data', () => {
  const forest = new Resource('Forest');
  const rock = new Resource('Rock');
  const inventory = new GemInventory();

  inventory.add(forest, 1);
  inventory.add(rock, 2);

  const data = inventory.getData();

  expect(data.Forest).toEqual(1);
  expect(data.Rock).toEqual(2);
});
