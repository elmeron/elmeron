import Promise from 'bluebird';

export default function RMI(emitter) {
  return new Proxy(emitter, {
    get: (target, method) => {
      if (method === 'on') {
        return event => new Promise(resolve => target.on(event, resolve));
      }

      if (method === 'once') {
        return event => new Promise(resolve => target.once(event, resolve));
      }

      return (...args) =>
        new Promise((resolve, reject) => target.emit(method, args, (err, result) => {
          if (err) {
            reject(new Error(err));
          } else {
            resolve(result);
          }
        }));
    },
  });
}
