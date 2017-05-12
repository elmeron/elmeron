import Player from '../player.js';
import Resource from '../world/resource.js';

test('buy gem', () => {
  const forest = new Resource('Forest');
  const player = new Player('Player');
  const productionValue = 1;

  player.gems.add(forest, 10);
  player.sellGem(forest, 10, 10, 1);

  expect(player.gems.count(forest)).toEqual(0);
  expect(player.fuel.getAmount(Date.now())).toEqual(110); // starting value is 100
});
