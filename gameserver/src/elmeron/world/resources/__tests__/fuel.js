import Fuel from '../fuel.js';

test('get initial amount', () => {
  const fuel = new Fuel(0, 1);

  expect(fuel.getAmount(1)).toBe(0);
});

test('get amount with bad time unit', () => {
  expect(() => new Fuel(0, 0)).toThrow();
});

test('add amount', () => {
  const fuel = new Fuel(0, 1);

  fuel.addAmount(10);

  expect(fuel.getAmount(0)).toBe(10);
});

test('set delta', () => {
  const fuel = new Fuel(0, 1);

  fuel.setDelta(1, 0);

  expect(fuel.getAmount(10)).toBe(10);
});

test('set delta => amount => delta again', () => {
  const fuel = new Fuel(0, 1);

  fuel.setDelta(1, 0);
  fuel.addAmount(10);
  fuel.setDelta(2, 10);

  expect(fuel.getAmount(20)).toBe(40);
});
