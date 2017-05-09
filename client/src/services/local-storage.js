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
