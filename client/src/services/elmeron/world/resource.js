export default class Resource {
  constructor(name) {
    this.name = name;
  }

  equals(resource) {
    return this.name === resource.name;
  }

  getData() {
    return {
      name: this.name,
    };
  }

  clone() {
    return new Resource(this.name);
  }
}
