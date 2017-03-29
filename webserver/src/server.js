import express from 'express';
import path from 'path';
import morgan from 'morgan';
import { webserverLogger as logger } from './logger';

const server = express();

server.use(morgan('dev', {
  stream: logger.stream,
}));
server.use(express.static(path.join(__dirname, 'static')));

server.listen(3000, () => logger.info('Elmeron Web Server running on port 3000'));
