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

  function customPolicy(players) {
    policy();
    return players.size === 2;
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

