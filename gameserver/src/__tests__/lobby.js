import Lobby from '../lobby';
import Game from '../elmeron/game.js';

const socketMock = {
  emit: () => {},
};

test('default policy', (done) => {
  const lobby = new Lobby(1);

  lobby.on('gameReady', (game) => {
    expect(game).toBeInstanceOf(Game);
    done();
  });

  lobby.registerPlayer('Test Player', socketMock);
});
