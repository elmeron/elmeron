import EventEmitter from 'events';
import { fromJS, Map, List } from 'immutable';

class RegisterStack {
  constructor() {
    this.register = new List();
  }

  push(player, gem, amount) {
    const last = this.register.last();

    if (last && last.player.equals(player) && last.gem.equals(gem)) {
      this.register = this.register.set(0, { player, gem, amount: amount + first.amount });
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

  count(gem) {
    return this.register.reduce((result, { gem: g, amount }) => {
      if (g.equals(gem)) {
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

  calculateFuelPrice(gem, amount, refineryProductionValue) {
    const globalAmount = this.getGlobalAmount(gem);

    if (globalAmount > 0) {
      const price = (amount * amount * refineryProductionValue) / globalAmount;

      if (price < 1) {
        return 1;
      }

      return Math.round(price);
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

  buyGemFromPlayers(player, gem, amount) {

  }
}
