import EventEmitter from 'events';
import RMI from '../rmi.js';

test('basic rmi', (done) => {
  const emitter = new EventEmitter();
  const rmi = RMI(emitter);

  emitter.on('foo', (args, callback) => {
    expect(args).toEqual(['bar']);
    callback(null, 'result');
  });

  rmi.foo('bar').then((result) => {
    expect(result).toEqual('result');
    done();
  });
});

test('with error', (done) => {
  const emitter = new EventEmitter();
  const rmi = RMI(emitter);

  emitter.on('foo', (args, callback) => {
    expect(args).toEqual(['bar']);
    callback('Something went wrong');
  });

  rmi.foo('bar').catch((err) => {
    expect(err.message).toEqual('Something went wrong');
    done();
  });
});

test('with on', (done) => {
  const emitter = new EventEmitter();
  const rmi = RMI(emitter);

  rmi.on('foo').then((data) => {
    expect(data).toEqual('bar');
    done();
  });

  emitter.emit('foo', 'bar');
});

test('with once', (done) => {
  const emitter = new EventEmitter();
  const rmi = RMI(emitter);

  rmi.once('foo').then((data) => {
    expect(data).toEqual('bar');
    done();
  });

  emitter.emit('foo', 'bar');
});
