import CountableResource from './countable-resource.js';

export default class IslandResource extends CountableResource {
  constructor(name, now, timeUnit) {
    super(name, now, timeUnit);
    this.canPickGem = false;
  }

  getData() {
    const data = super.getData();
    data.canPickGem = this.canPickGem;

    return data;
  }

  clone() {
    const copy = new IslandResource(this.name, 0, 1);
    copy.deltaAmount = this.deltaAmount.clone();
    copy.canPickGem = this.canPickGem;

    return copy;
  }
}
