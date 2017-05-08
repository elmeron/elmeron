import winston from 'winston';
import moment from 'moment';
import path from 'path';

winston.loggers.add('webserver', {
  console: {
    colorize: true,
    timestamp: () => moment().format(),
  },

  file: {
    colorize: true,
    timestamp: () => moment().format(),
    filename: path.join(__dirname, '../webserver.log'),
    json: false,
    maxsize: 10000000, // 10 MB
    maxFiles: 2,
  },
});

const logger = winston.loggers.get('webserver');

// used by morgan in express
logger.stream = {
  write: message => logger.info(message.slice(0, -1)),
};

export default logger;
