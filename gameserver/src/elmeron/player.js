import EventEmitter from 'events';
import Fuel from './world/resources/fuel.js';
import GemInventory from './gem-inventory.js';
import Position from './world/position.js';
import Refinery from './world/refinery.js';
import Resource from './world/resource.js';

const timeUnit = 1000;

export default class Player extends EventEmitter {
  constructor(nickname) {
    super();
    this.nickname = nickname;
    this.hasLeftGame = false;
    this.location = undefined;
    this.fuel = new Fuel(Date.now(), timeUnit);
    this.gems = new GemInventory();

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
    const gemCost = Refinery.getPrice(positions);
    const canAfford = gemCost.every((amount, resourceName) => {
      const resource = new Resource(resourceName);

      return this.gems.count(resource) >= amount;
    });

    if (canAfford) {
      const { tiles, delta } = this.location.buildRefinery(
        positions,
        (deltaChange) => {
          this.addFuelDelta(deltaChange);
          const { fuel } = this.getData();
          this.emit('refineryChange', { fuel });
        }
      );

      gemCost.forEach((amount, resourceName) => {
        const resource = new Resource(resourceName);

        this.gems.add(resource, -amount);
      });

      this.addFuelDelta(delta);

      const { fuel, gems } = this.getData();

      this.emit('refineryBuilt', { tiles, fuel, gems });
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

  pickGem({ q, r }) {
    const position = new Position(q, r);
    const pickedResource = this.location.pickGem(position, Date.now());

    this.gems.add(pickedResource, 1);
    this.emit('getPlayer', this.getData());
  }

  getData() {
    return {
      fuel: this.fuel.getData(),
      gems: this.gems.getData(),
    };
  }
}
