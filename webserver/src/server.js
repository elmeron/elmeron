import express from 'express';
import path from 'path';
import morgan from 'morgan';
import logger from './logger';

const server = express();
const port = process.env.PORT || 3000;

server.use(morgan('dev', {
  stream: logger.stream,
}));
server.use(express.static(path.join(__dirname, 'static')));

const listener = server.listen(port, () => {
  const p = listener.address().port;
  logger.info(`Elmeron Web Server running on port ${p}`);
});
