import { fromJS } from 'immutable';
import Market from '../market.js';
import Player from '../player.js';
import Resource from '../world/resource.js';

describe('register', () => {
  describe('count', () => {
    const forest = new Resource('Forest');
    const rock = new Resource('Rock');
    const player = new Player('Player');
    const otherPlayer = new Player('Other Player');
    const market = new Market();

    market.registerIncrease(player, forest, 10);
    market.registerIncrease(player, rock, 10);
    market.registerIncrease(otherPlayer, forest, 10);

    test('without player', () => {
      expect(market.register.count(forest)).toEqual(20);
    });

    test('with player', () => {
      expect(market.register.count(forest, player)).toEqual(10);
    });
  });
});

test('global amount', () => {
  const forest = new Resource('Forest');
  const market = new Market();

  expect(market.getGlobalAmount(forest)).toEqual(0);
  market.registerIncrease(new Player('Player'), forest, 10);
  expect(market.getGlobalAmount(forest)).toEqual(10);
});

test('calculate fuel price', () => {
  const forest = new Resource('Forest');
  const market = new Market();

  market.registerIncrease(new Player('Player'), forest, 10);
  expect(market.calculateFuelPrice(forest, 1)).toEqual(1);
});

test('register increase', () => {
  const forest = new Resource('Forest');
  const rock = new Resource('Rock');
  const player = new Player('Player');
  const market = new Market();

  market.registerIncrease(player, forest, 10);
  market.registerIncrease(player, rock, 5);
  market.registerIncrease(player, forest, 5);
  market.registerIncrease(player, rock, 10);
  market.registerIncrease(player, rock, 10);

  expect(market.getData()).toEqual({
    Forest: 15,
    Rock: 25,
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

test('buy gems from other players', () => {
  const forest = new Resource('Forest');
  const buyer = new Player('Buyer');
  const seller = new Player('Seller');
  const market = new Market();
  const refineryProductionValue = 1;

  buyer.market = market;
  seller.market = market;

  buyer.initStartResources();
  seller.initStartResources();

  seller.gems.add(forest, 10);
  buyer.gems.add(forest, 5);

  market.registerIncrease(seller, forest, 5);
  market.registerIncrease(buyer, forest, 5);
  market.registerIncrease(seller, forest, 5);

  const pricePerGem = market.calculateFuelPrice(forest, refineryProductionValue);
  market.buyGems(buyer, forest, 10, pricePerGem);

  expect(market.getGlobalAmount(forest)).toEqual(19);
  expect(seller.gems.count(forest)).toEqual(2);
  expect(seller.getFuelAmount()).toEqual(110);
  expect(buyer.gems.count(forest)).toEqual(17);
  expect(buyer.getFuelAmount()).toEqual(90);
});
