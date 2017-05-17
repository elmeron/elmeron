import Chance from 'chance';
import EventEmitter from 'events';
import { Map, List } from 'immutable';
import SpaceNode from './world/space-node.js';
import Market from './market.js';
import ElmeronResource from './world/resources/elmeron.js';
import logger from '../logger.js';

export default class Game extends EventEmitter {
  constructor(players, onElmeronFound) {
    super();
    this.id = new Chance().hash({ length: 6 });
    this.elmeronFound = false;
    this.players = players.reduce((result, player) =>
      result.set(player.nickname, player),
    new Map());

    this.market = new Market(this.players);
    this.market.on('marketUpdate', data => this.emit('marketUpdate', data));

    this.world = new SpaceNode(onElmeronFound);
    this.world.on('elmeronFound', (data) => {
      this.elmeronFound = true;
      this.emit('elmeronFound', data, this.world);
    });

    // populate the world with one island per player
    const populated = this.world.populate(this.players.size);

    logger.info(`Populated ${populated} islands`);

    // add Elmeron to the deck
    this.world.deck.distribution.set(new ElmeronResource(), 1);
    this.world.deck.size += 1;

    // make a list of all islands and shuffle it
    const islands = this.world.children.reduce((result, planet) =>
      result.concat(planet.children.reduce((r, island) =>
        r.push(island)
      , new List()))
    , new List()).sortBy(Math.random);

    // put all players on a unique island
    this.players.toList().forEach((player, index) => {
      player.setLocation(islands.get(index));
      player.market = this.market;

      logger.info(`${player.nickname} -> ${player.location.name}`);
    });
  }

  getPlayer(nickname) {
    return this.players.get(nickname);
  }

  getPlayersStatus() {
    return this.players.reduce((result, player) =>
      result.push(new Map({
        nickname: player.nickname,
        location: player.location.name,
        online: player.online,
        hasLeft: player.hasLeftGame,
      }))
    , new List()).toJS();
  }

  allPlayersHasLeft() {
    return this.players.every(player => player.hasLeftGame);
  }

  notifyPlayersStatus() {
    this.emit('playersStatusUpdate', this.getPlayersStatus());
  }
}
