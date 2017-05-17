import Player from '../player.js';
import Resource from '../world/resource.js';
import Market from '../market.js';

test('sell gem', (done) => {
  const forest = new Resource('Forest');
  const player = new Player('Player');
  const productionValue = 1;
  const market = new Market();

  player.market = market;

  player.on('getPlayer', ({ gems }) => {
    expect(player.gems.count(forest)).toEqual(0);
    expect(player.fuel.getAmount(Date.now())).toEqual(10);
    expect(gems).toEqual({
      Forest: 0,
    });
    done();
  });

  player.gems.add(forest, 10);
  market.registerIncrease(player, forest, 10);
  player.sellGems(forest, 10, 10);
});

test('buy gem', (done) => {
  const forest = new Resource('Forest');
  const player = new Player('Player');
  const productionValue = 1;
  const market = new Market();

  player.market = market;
  player.initStartResources();

  player.on('getPlayer', ({ gems }) => {
    expect(player.gems.count(forest)).toEqual(12);
    expect(player.fuel.getAmount(Date.now())).toEqual(90); // starting value is 100
    done();
  });

  player.buyGems(forest, 10, 10);
});
