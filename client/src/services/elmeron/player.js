import Fuel from './world/resources/fuel.js';

const timeUnit = 1000;

export default class Player {
  constructor(nickname) {
    this.nickname = nickname;
    this.location = undefined;
    this.fuel = new Fuel(Date.now(), timeUnit);

    this.fuel.addAmount(100);
  }

  getFuelAmount() {
    const now = Date.now();
    return this.fuel.getAmount(now);
  }

  addFuelDelta(delta) {
    const now = Date.now();
    const { delta: previousDelta } = this.fuel.getData();

    this.fuel.setDelta(delta + previousDelta, now);
  }

  addFuelAmount(amount) {
    this.fuel.addAmount(amount);
  }

  getData() {
    return {
      fuel: this.fuel.getData(),
    };
  }
}
