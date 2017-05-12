import EventEmitter from 'events';
import { fromJS, Map } from 'immutable';

export default class Market extends EventEmitter {
  constructor(players) {
    super();
    this.players = players;
  }

  getGlobalAmount(gem) {
    return this.players.reduce((result, player) =>
      result + player.gems.count(gem)
    , 0);
  }

  calculateFuelPrice(gem, amount, refineryProductionValue) {
    const globalAmount = this.getGlobalAmount(gem);

    if (globalAmount > 0) {
      const price = (amount * refineryProductionValue) / globalAmount;

      if (price < 1) {
        return 1;
      }

      return Math.round(price);
    }

    throw new Error(`Cannot calculate fuel price: There are no ${game.name} on the market`);
  }

  getData() {
    return this.players.reduce((result, player) => {
      const gems = fromJS(player.gems.getData());

      return gems.reduce((acc, amount, name) => {
        const currentAmount = acc.get(name) || 0;
        return acc.set(name, currentAmount + amount);
      }, result);
    }, new Map()).toJS();
  }

  notifyUpdate() {
    this.emit('marketUpdate', this.getData());
  }
}
