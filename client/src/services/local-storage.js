/* globals localStorage */

class LocalStorage {
  constructor() {
    const mockStorage = {
      setItem: () => {},
      getItem: () => {},
      removeItem: () => {},
    };
    this.storage = typeof Storage === 'undefined' ?
      mockStorage : localStorage;

    // make sure storage can be set
    try {
      this.storage.setItem('dummy', '');
      this.storage.removeItem('dummy');
    } catch (e) {
      // storage could not be set, use mock
      this.storage = mockStorage;
    }
  }

  saveData(gameId, nickname) {
    const data = JSON.stringify({ gameId, nickname });

    this.storage.setItem('elmeron', data);
  }

  getData() {
    const data = this.storage.getItem('elmeron') || '{}';
    return JSON.parse(data);
  }

  deleteData() {
    this.storage.removeItem('elmeron');
  }
}

export default new LocalStorage();
