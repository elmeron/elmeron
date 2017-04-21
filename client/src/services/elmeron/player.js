import Fuel from './world/resources/fuel.js';

const timeUnit = 1000;

export default class Player {
  constructor(nickname) {
    this.nickname = nickname;
    this.location = undefined;
    this.fuel = new Fuel(Date.now(), timeUnit);

    this.fuel.addAmount(100);
    this.fuel.setDelta(1, Date.now());
  }

  getFuelAmount() {
    const now = Date.now();
    return this.fuel.getAmount(now);
  }

  setFuelDelta(delta) {
    const now = Date.now();
    this.fuel.setDelta(delta, now);
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
