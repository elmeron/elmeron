import EventEmitter from 'events';
import Fuel from './world/resources/fuel.js';
import Position from './world/position.js';
import Refinery from './world/refinery.js';

const timeUnit = 1000;

export default class Player extends EventEmitter {
  constructor(nickname) {
    super();
    this.nickname = nickname;
    this.location = undefined;
    this.fuel = new Fuel(Date.now(), timeUnit);

    this.fuel.addAmount(100);

    this.onExplore = this.onExplore.bind(this);
    this.onRefineryChange = this.onRefineryChange.bind(this);
  }

  zoomIn(childName) {
    const child = this.location.getChild(childName);

    if (child) {
      this.setLocation(child);
      this.emit('getWorld', this.location.getData());
    }
  }

  zoomOut() {
    const parent = this.location.parent;

    if (parent) {
      this.setLocation(parent);
      this.emit('getWorld', this.location.getData());
    }
  }

  explore(position) {
    const explorationCost = this.location.explorationCost;
    const fuelAmount = this.getFuelAmount();

    if (fuelAmount >= explorationCost) {
      const explorationResult = this.location.explore(new Position(position.q, position.r));

      this.addFuelAmount(-explorationCost);
      this.emit('getPlayer', this.getData());
      this.location.emit('explore', explorationResult);
    }
  }

  onExplore(data) {
    this.emit('explore', data);
  }

  onRefineryChange(data) {
    this.emit('refineryChange', data);
  }

  buildRefinery(positions) {
    const price = Refinery.getPrice(positions);
    const fuelAmount = this.getFuelAmount();

    if (fuelAmount >= price) {
      const { tiles, delta } = this.location.buildRefinery(
        positions,
        (deltaChange) => {
          this.addFuelDelta(deltaChange);
          const { fuel } = this.getData();
          this.emit('refineryChange', { fuel });
        }
      );

      this.addFuelAmount(-price);
      this.addFuelDelta(delta);

      const { fuel } = this.getData();

      this.emit('refineryBuilt', { tiles, fuel });
    }
  }

  setLocation(location) {
    if (this.location) {
      this.location.removeListener('explore', this.onExplore);
      this.location.removeListener('refineryChange', this.onRefineryChange);
    }

    this.location = location;
    this.location.on('explore', this.onExplore);
    this.location.on('refineryChange', this.onRefineryChange);
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
