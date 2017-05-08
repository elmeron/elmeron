import io from 'socket.io-client';
import createGameServer from '../gameserver.js';

describe('one player game start', () => {
  let server = 0;
  let url = '';

  beforeAll((done) => {
    server = createGameServer(0, ({ port }) => {
      url = `http://localhost:${port}`;
      done();
    });
  });

  afterAll(() => server.close());

  test('one player lobby', (done) => {
    let client = io(url);
    const nickname = 'Test Player';

    client.once('connect', () => {
      client.once('gameReady', ({ id }) => {
        expect(id).not.toBeUndefined();

        client = io(`${url}/${id}`);

        client.once('getPlayer', data => {
          done();
        });

        client.once('connect', () => {
          client.emit('joinGame', { nickname }, (success) => {
            expect(success).toBeTruthy();

            client.emit('getPlayer');
          });
        });
      });

      client.emit('startGame', { nickname });
    });
  });
});
