import Chance from 'chance';

export default class Game {
  constructor(players) {
    this.id = new Chance().hash({ length: 6 });
    this.players = players;
  }
}
