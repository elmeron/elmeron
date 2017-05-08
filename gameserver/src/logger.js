import winston from 'winston';
import moment from 'moment';
import path from 'path';

winston.loggers.add('gameserver', {
  console: {
    colorize: true,
    timestamp: () => moment().format(),
  },

  file: {
    silent: process.env.NODE_ENV !== 'production',
    colorize: true,
    timestamp: () => moment().format(),
    filename: path.join(__dirname, '../gameserver.log'),
    json: false,
    maxsize: 10000000, // 10 MB
    maxFiles: 2,
  },
});

winston.loggers.add('test', {
  console: {
    silent: true,
  },
});

const logger = process.env.NODE_ENV === 'test' ?
                winston.loggers.get('test') :
                winston.loggers.get('gameserver');

export default logger;
