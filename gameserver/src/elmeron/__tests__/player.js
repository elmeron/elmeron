import Player from '../player.js';
import Resource from '../world/resource.js';

test('sell gem', (done) => {
  const forest = new Resource('Forest');
  const player = new Player('Player');
  const productionValue = 1;

  player.on('getPlayer', ({ gems }) => {
    expect(player.gems.count(forest)).toEqual(0);
    expect(player.fuel.getAmount(Date.now())).toEqual(110); // starting value is 100
    expect(gems).toEqual({
      Forest: 0,
    });
    done();
  });

  player.gems.add(forest, 10);
  player.sellGems(forest, 10, 10);
});

test('sell gem', (done) => {
  const forest = new Resource('Forest');
  const player = new Player('Player');
  const productionValue = 1;

  player.on('getPlayer', ({ gems }) => {
    expect(player.gems.count(forest)).toEqual(10);
    expect(player.fuel.getAmount(Date.now())).toEqual(90); // starting value is 100
    done();
  });

  player.buyGems(forest, 10, 10);
});
