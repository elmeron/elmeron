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

export const webserverLogger = winston.loggers.get('webserver');
webserverLogger.stream = {
  write: message => webserverLogger.info(message.slice(0, -1)),
};
