import Elmeron from '../';

test('start game', (done) => {
  const elmeron = new Elmeron();

  elmeron.on('gameStart', (payload) => {
    expect(payload).toBeDefined();
    expect(payload.id).toBeDefined();
    expect(payload.player).toBeDefined();
    expect(payload.player.nickname).toBe('test');
    done();
  });

  elmeron.startGame('test');
});
