import { fromJS } from 'immutable';
import Market from '../market.js';
import Player from '../player.js';
import Resource from '../world/resource.js';

test('global amount', () => {
  const forest = new Resource('Forest');
  const player = new Player('Player');
  const players = fromJS({
    [player.nickname]: player,
  });
  const market = new Market(players);

  expect(market.getGlobalAmount(forest)).toEqual(0);
  player.gems.add(forest, 10);
  expect(market.getGlobalAmount(forest)).toEqual(10);
});

test('calculate fuel price', () => {
  const forest = new Resource('Forest');
  const player = new Player('Player');
  const players = fromJS({
    [player.nickname]: player,
  });
  const market = new Market(players);

  expect(() => market.calculateFuelPrice(forest)).toThrow();
  player.gems.add(forest, 10);
  expect(market.calculateFuelPrice(forest, 1, 1)).toEqual(1);
});

test('get data', () => {
  const forest = new Resource('Forest');
  const rock = new Resource('Rock');
  const p1 = new Player('Player 1');
  const p2 = new Player('Player 2');
  const players = fromJS({
    [p1.nickname]: p1,
    [p2.nickname]: p2,
  });
  const market = new Market(players);

  p1.gems.add(forest, 5);
  p1.gems.add(rock, 5);
  p2.gems.add(forest, 10);
  p2.gems.add(rock, 10);

  expect(market.getData()).toEqual({
    Forest: 15,
    Rock: 15,
  });
});
