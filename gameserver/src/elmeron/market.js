import assert from 'assert';
import EventEmitter from 'events';
import { fromJS, Map, List } from 'immutable';
import logger from '../logger.js';

class RegisterStack {
  constructor() {
    this.register = new List();
  }

  push(player, gem, amount) {
    const last = this.register.last();

    if (last && last.player.equals(player) && last.gem.equals(gem)) {
      const lastIndex = this.register.size - 1;
      this.register = this.register.set(lastIndex, { player, gem, amount: amount + last.amount });
    } else {
      this.register = this.register.push({ player, gem, amount });
    }
  }

  pop(player, gem, amount) {
    const index = this.register.findIndex(({ player: p, gem: g }) =>
      p.equals(player) && g.equals(gem)
    );

    if (index === -1) {
      throw new Error('Cannot pop register: player and gem not found');
    }

    const { amount: a } = this.register.get(index);

    if (a > amount) {
      this.register = this.register.set(index, { player, gem, amount: a - amount });
    } else {
      this.register = this.register.delete(index);

      if (a < amount) {
        this.pop(player, gem, amount - a);
      }
    }
  }

  count(gem, player) {
    return this.register.reduce((result, { gem: g, amount, player: p }) => {
      const correctPlayer = player ? p.equals(player) : true;

      if (g.equals(gem) && correctPlayer) {
        return result + amount;
      }

      return result;
    }, 0);
  }

  getData() {
    return this.register.reduce((result, { gem, amount }) => {
      const currentAmount = result.get(gem.name) || 0;
      return result.set(gem.name, currentAmount + amount);
    }, new Map()).toJS();
  }

  findFirst(notThisPlayer, gem) {
    return this.register.find(({ player, gem: g }) =>
      !player.equals(notThisPlayer) && g.equals(gem)
    );
  }
}

export default class Market extends EventEmitter {
  constructor() {
    super();
    this.register = new RegisterStack();
  }

  getGlobalAmount(gem) {
    return this.register.count(gem);
  }

  calculateFuelPrice(gem, refineryProductionValue) {
    const globalAmount = this.getGlobalAmount(gem);

    if (globalAmount > 0) {
      return refineryProductionValue / globalAmount;
    }

    throw new Error(`Cannot calculate fuel price: There are no ${gem.name} on the market`);
  }

  getData() {
    return this.register.getData();
  }

  notifyUpdate() {
    this.emit('marketUpdate', this.getData());
  }

  registerIncrease(player, gem, amount) {
    this.register.push(player, gem, amount);
  }

  registerDecrease(player, gem, amount) {
    this.register.pop(player, gem, amount);
  }

  buyGems(player, gem, amount, pricePerGem) {
    assert(pricePerGem > 0, 'Price per gem must be set > 0');

    if (this.getGlobalAmount(gem) >= amount) {
      const { player: seller, amount: sellerAmount } = this.register.findFirst(player, gem);
      const smallestAmount = Math.min(amount, sellerAmount);
      const fuelPrice = Math.round(amount * pricePerGem);

      player.buyGems(gem, smallestAmount, fuelPrice);
      seller.sellGems(gem, smallestAmount, fuelPrice);
      this.registerDecrease(seller, gem, smallestAmount);

      logger.debug(`${player.nickname} bought ${smallestAmount} ${gem.name} for ${fuelPrice} fuel from ${seller.nickname}`);

      if (amount > sellerAmount) {
        this.buyGems(player, gem, amount - sellerAmount, pricePerGem);
      }
    } else {
      throw new Error('Cannot buy gems from market: Not enough gems available');
    }
  }
}
