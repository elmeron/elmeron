import http from 'http';
import io from 'socket.io';

const httpServer = http.createServer();
const server = io(httpServer);

httpServer.listen(3000);

server.on('connection', (socket) => {
  console.log('got connection!');

  socket.on('hello', () => {
    socket.emit('new', { hello: 'world' });
  });
});
