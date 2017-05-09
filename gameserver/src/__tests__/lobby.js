import Lobby from '../lobby';
import Game from '../elmeron/game.js';

const socketMock = {
  emit: () => {},
};

test('default policy', (done) => {
  const lobby = new Lobby();

  lobby.on('gameReady', (game) => {
    expect(game).toBeInstanceOf(Game);
    done();
  });

  lobby.registerPlayer('Test Player', socketMock);
});

test('custom policy', (done) => {
  const policy = jest.fn();

  function customPolicy(players, ready) {
    policy();
    if (players.size === 2) {
      ready();
    }
  }

  const lobby = new Lobby(customPolicy);

  lobby.on('gameReady', (game) => {
    expect(policy).toHaveBeenCalledTimes(2);
    expect(game.players.size).toEqual(2);
    done();
  });

  lobby.registerPlayer('Player 1', socketMock);
  lobby.registerPlayer('Player 2', socketMock);
});

test('async policy', (done) => {
  const gameReady = jest.fn();
  let timer = 0;

  function asyncPolicy(players, ready) {
    if (timer) {
      clearTimeout(timer);
    }

    if (players.size === 2) {
      return ready();
    }

    timer = setTimeout(ready, 1000);
  }

  const lobby = new Lobby(asyncPolicy);

  lobby.on('gameReady', (game) => {
    gameReady();
    const calls = gameReady.mock.calls.length;

    if (calls === 1) {
      expect(game.players.size).toEqual(2);
      expect(game.players.has('Player 1')).toBeTruthy();
      expect(game.players.has('Player 2')).toBeTruthy();
    } else if (calls === 2) {
      expect(game.players.size).toEqual(1);
      expect(game.players.has('Player 3')).toBeTruthy();
      done();
    }
  });

  lobby.registerPlayer('Player 1', socketMock);
  lobby.registerPlayer('Player 2', socketMock);
  setTimeout(() => lobby.registerPlayer('Player 3', socketMock), 1500);
});
