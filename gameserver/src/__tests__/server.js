import io from 'socket.io-client';
import Server from '../server.js';

let port = 0;
let url = '';
let server = 0;

beforeAll((done) => {
  server = new Server(port);
  server.on('listening', ({ port: p }) => {
    port = p;
    url = `http://localhost:${port}`;
    done();
  });
});

afterAll(() => server.close());

test('simple echo', (done) => {
  const client = io(url);
  const message = 'thismessageshouldbeechoed';

  client.on('echo', (echo)  => {
    expect(echo).toEqual(message);
    done();
  });

  server.on('connection', (socket) => {
    socket.on('echo', echo => {
      socket.emit('echo', echo)
    });
  });

  client.emit('echo', message);
});
