import CountableResource from '../countable-resource.js';

export default class Fuel extends CountableResource {
  constructor(now, timeUnit) {
    super('Fuel', now, timeUnit);
  }
}
