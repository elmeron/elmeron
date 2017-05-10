import EventEmitter from 'events';
import requestResponseSkeleton from '../skeleton.js';

test('request response skeleton', (done) => {
  const target = {
    foo: () => 'bar',
  };
  const packet = ['foo', [], (err, result) => {
    expect(result).toEqual('bar');
    done();
  }];

  requestResponseSkeleton(target, packet);
});
