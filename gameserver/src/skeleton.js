import logger from './logger.js';

const isDev = process.env.NODE_ENV === 'development';

function unmarshall(packet) {
  const method = packet[0];
  const args = packet[1];
  const ack = packet[2];

  if (method && args && args.length >= 0 && ack && typeof ack === 'function') {
    return { method, args, ack };
  }

  throw new Error(`Bad socket package: ${packet}`);
}

export default function requestResponseSkeleton(target, packet, ...customArgs) {
  const { method, args, ack } = unmarshall(packet);
  const invocation = target[method];

  if (invocation) {
    try {
      const result = invocation.call(target, ...args, ...customArgs);
      logger.debug(`${method}(${args}) -> ${result}`);
      ack(null, result);
    } catch (e) {
      logger.error(`${method}(${args}) -> ${e.name}: ${e.message}`);

      if (isDev) {
        logger.error(e);
      }

      ack(e.message);
    }
  } else {
    const message = `No such method '${method}'`;
    logger.error(`${method}(${args}) -> ${message}`);
    ack(message);
  }
}
