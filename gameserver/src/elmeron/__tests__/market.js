import { fromJS } from 'immutable';
import Market from '../market.js';
import Player from '../player.js';
import Resource from '../world/resource.js';

test('global amount', () => {
  const forest = new Resource('Forest');
  const market = new Market();

  expect(market.getGlobalAmount(forest)).toEqual(0);
  market.registerIncrease(undefined, forest, 10);
  expect(market.getGlobalAmount(forest)).toEqual(10);
});

test('calculate fuel price', () => {
  const forest = new Resource('Forest');
  const market = new Market();

  expect(() => market.calculateFuelPrice(forest)).toThrow();
  market.registerIncrease(undefined, forest, 10);
  expect(market.calculateFuelPrice(forest, 1, 1)).toEqual(1);
});

test('get data', () => {
  const forest = new Resource('Forest');
  const rock = new Resource('Rock');
  const player = new Player('Player');
  const market = new Market();

  market.registerIncrease(player, forest, 10);
  market.registerIncrease(player, rock, 5);
  market.registerIncrease(player, forest, 5);
  market.registerIncrease(player, rock, 10);

  expect(market.getData()).toEqual({
    Forest: 15,
    Rock: 15,
  });
});

test('register decrease', () => {
  const forest = new Resource('Forest');
  const rock = new Resource('Rock');
  const player = new Player('Player');
  const market = new Market();

  market.registerIncrease(player, forest, 10);
  market.registerIncrease(player, rock, 5);
  market.registerIncrease(player, forest, 5);
  market.registerIncrease(player, rock, 10);
  market.registerDecrease(player, forest, 5);

  expect(market.getData()).toEqual({
    Forest: 10,
    Rock: 15,
  });
});

test('find first', () => {
  const forest = new Resource('Forest');
  const rock = new Resource('Rock');
  const player = new Player('Player');
  const otherPlayer = new Player('Other Player');
  const market = new Market();

  market.registerIncrease(player, forest, 10);
  market.registerIncrease(player, rock, 5);
  market.registerIncrease(otherPlayer, forest, 5);
  market.registerIncrease(player, rock, 10);

  expect(market.register.findFirst(player, forest).player).toBe(otherPlayer);
  expect(market.register.findFirst(otherPlayer, forest).player).toBe(player);
});
