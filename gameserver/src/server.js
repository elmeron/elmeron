import EventEmitter from 'events';
import http from 'http';
import io from 'socket.io';

export default class Server extends EventEmitter {
  constructor(port) {
    super();
    this.httpServer = http.createServer();
    this.socketServer = io(this.httpServer);

    this.socketServer.on('connection', socket =>
      this.emit('connection', socket)
    );

    this.httpServer.listen(port, () =>
      this.emit('listening', this.httpServer.address())
    );
  }

  of(namespace) {
    return this.socketServer.of(namespace);
  }

  close() {
    this.socketServer.close();
    this.httpServer.close();
  }
}
