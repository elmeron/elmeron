import EventEmitter from 'events';
import { Set } from 'immutable';
import logger from '../logger.js';
import Fuel from './world/resources/fuel.js';
import GemInventory from './gem-inventory.js';
import Position from './world/position.js';
import Refinery from './world/refinery.js';
import Resource from './world/resource.js';
import Forest from './world/resources/forest.js';
import Rock from './world/resources/rock.js';
import Sand from './world/resources/sand.js';
import Ocean from './world/resources/ocean.js';
import ExplorationCostCounter from './exploration-cost-counter.js';

const timeUnit = 1000;

export default class Player extends EventEmitter {
  constructor(nickname) {
    super();
    this.nickname = nickname;
    this.online = false;
    this.hasLeftGame = false;
    this.location = undefined;
    this.fuel = new Fuel(Date.now(), timeUnit);
    this.gems = new GemInventory();
    this.exploredTiles = new GemInventory();
    this.market = undefined;
    this.hasExploredFirstIsland = false;
    this.costCounter = new ExplorationCostCounter();

    this.delta = 1;
    this.fuelAmount = 0;

    this.onExplore = this.onExplore.bind(this);
    this.onRefineryChange = this.onRefineryChange.bind(this);
    this.onGenerateGems = this.onGenerateGems.bind(this);
  }

  initStartResources() {
    const origo = new Position(0, 0);
    const startResource = this.location.grid.getTile(origo).resource.clone();

    this.exploredTiles.add(startResource, 1);
    this.fuel.addAmount(100);
    this.gems.add(new Forest(), 2);
    this.gems.add(new Rock(), 2);
    this.gems.add(new Sand(), 2);

    // this.market.registerIncrease(this, new Forest(), 2);
    // this.market.registerIncrease(this, new Rock(), 2);
    // this.market.registerIncrease(this, new Sand(), 2);
  }

  equals(player) {
    return this.nickname === player.nickname;
  }

  notifyMarket() {
    if (this.market) {
      this.market.notifyUpdate();
    }
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
    const explorationCost = this.costCounter.getExplorationCost();
    const fuelAmount = this.getFuelAmount();

    if (fuelAmount >= explorationCost) {
      const pos = new Position(position.q, position.r);
      const explorationResult = this.location.explore(pos, this);

      if (this.location.getNodeType() === 'IslandNode') {
        const exploredResource = this.location.grid.getTile(pos).resource.clone();

        if (!exploredResource.equals(new Ocean())) {
          this.exploredTiles.add(exploredResource, 1);
        }
      }

      this.costCounter.increaseCount(this.location);
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

  onGenerateGems(data) {
    this.emit('generateGems', data);
  }

  buildRefinery(positions) {
    const gemCost = Refinery.getPrice(positions);
    const canAffordWithGems = gemCost.every((amount, resourceName) => {
      const resource = new Resource(resourceName);

      return this.gems.count(resource) >= amount;
    });

    if (canAffordWithGems) {
      logger.debug(`${this.nickname} is building a refinery`);

      const { tiles, delta } = this.location.buildRefinery(
        positions,
        (deltaChange) => {
          this.addFuelDelta(deltaChange);
          const { fuel } = this.getData();
          this.emit('refineryChange', { fuel });
        }
      );

      positions.forEach((position) => {
        const { name } = position.resource;
        const resource = new Resource(name);
        this.exploredTiles.add(resource, -1);
      });

      gemCost.forEach((amount, resourceName) => {
        const resource = new Resource(resourceName);

        this.gems.add(resource, -amount);
        // this.market.registerDecrease(this, resource, amount);
      });

      this.addFuelDelta(delta);

      const { fuel, gems, exploredTiles, fuelAmount, delta: _delta } = this.getData();

      this.emit('refineryBuilt', { tiles, fuel, gems, exploredTiles, fuelAmount, delta: _delta });
      // this.notifyMarket();
    }
    /*else {
      const productionValue = Refinery.calculateProductionValue(new Set(positions));
      const totalFuelPrice = gemCost.reduce((result, amount, resourceName) => {
        const gem = new Resource(resourceName);
        const requiredAmount = Math.max(amount - this.gems.count(gem), 0);
        const pricePerGem = this.market.calculateFuelPrice(gem, productionValue);

        return result + Math.round(requiredAmount * pricePerGem);
      }, 0);

      if (totalFuelPrice <= this.getFuelAmount()) {
        gemCost.forEach((amount, resourceName) => {
          const gem = new Resource(resourceName);
          const requiredAmount = Math.max(amount - this.gems.count(gem), 0);

          if (requiredAmount > 0) {
            const pricePerGem = this.market.calculateFuelPrice(gem, productionValue);

            this.market.buyGems(this, gem, requiredAmount, pricePerGem);
          }
        });

        this.buildRefinery(positions);
      }
      else {
        throw new Error('Cannot build refinery: Not enough gems');
      }
    }
    */
  }

  setLocation(location) {
    if (this.location) {
      this.location.removeListener('explore', this.onExplore);
      this.location.removeListener('refineryChange', this.onRefineryChange);
      this.location.removeListener('generateGems', this.onGenerateGems);
    }

    this.location = location;
    this.location.on('explore', this.onExplore);
    this.location.on('refineryChange', this.onRefineryChange);
    this.location.on('generateGems', this.onGenerateGems);
  }

  getFuelAmount() {
    /*
    const now = Date.now();
    return this.fuel.getAmount(now);
    */
    return this.fuelAmount;
  }

  addFuelDelta(delta) {
    /*
    const now = Date.now();
    const { delta: previousDelta } = this.fuel.getData();

    this.fuel.setDelta(delta + previousDelta, now);
    */
    this.delta += delta;
  }

  addFuelAmount(amount) {
    // this.fuel.addAmount(amount);
    this.fuelAmount += amount;
  }

  resetFuelAmount(timeInterval) {
    /*
    const amount = this.getFuelAmount();
    this.addFuelAmount(-amount);
    */
    this.fuelAmount = Math.round(this.delta * timeInterval);
  }

  pickGem({ q, r }) {
    const position = new Position(q, r);
    const pickedResource = this.location.pickGem(position, Date.now());

    this.gems.add(pickedResource, 1);
    this.emit('getPlayer', this.getData());
    this.market.registerIncrease(this, pickedResource, 1);
    this.notifyMarket();
  }

  sellGems(gem, amount, fuel) {
    if (this.gems.count(gem) >= amount) {
      this.gems.add(gem, -amount);
      this.market.registerDecrease(this, gem, amount);
      this.fuel.addAmount(fuel);
      this.emit('getPlayer', this.getData());
    } else {
      throw new Error('Cannot sell gem: Not enough gems in inventory');
    }
  }

  buyGems(gem, amount, fuel) {
    if (this.getFuelAmount() >= fuel) {
      this.fuel.addAmount(-fuel);
      this.gems.add(gem, amount);
      this.market.registerIncrease(this, gem, amount);
      this.emit('getPlayer', this.getData());
    } else {
      throw new Error('Cannot buy gem: Not enough fuel');
    }
  }

  resetGems() {
    const forestCount = this.exploredTiles.count(new Forest());
    const rockCount = this.exploredTiles.count(new Rock());
    const sandCount = this.exploredTiles.count(new Sand());

    this.gems.set(new Forest(), forestCount);
    this.gems.set(new Rock(), rockCount);
    this.gems.set(new Sand(), sandCount);
  }

  getData() {
    return {
      fuel: this.fuel.getData(),
      gems: this.gems.getData(),
      exploredTiles: this.exploredTiles.getData(),
      hasExploredFirstIsland: this.hasExploredFirstIsland,
      explorationCost: this.costCounter.getExplorationCost(),
      fuelAmount: this.fuelAmount,
      delta: this.delta,
    };
  }
}
