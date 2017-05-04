import Terraformer from '../terraformer';
import TerraformHandler from '../terraform-handler';

/* eslint-disable */
class Handler1 extends TerraformHandler {
  static canHandle() {
    return false;
  }
}

class Handler2 extends TerraformHandler {
  static canHandle() {
    return true;
  }

  static makeTiles() {
    return 'Handler2';
  }
}
/* eslint-enable */

describe('terraformer', () => {
  const terraformer = new Terraformer([
    new Handler1(),
    new Handler2(),
  ]);

  it('should be handled by correct handler', () => {
    expect(terraformer.makeTiles()).toEqual('Handler2');
  });
});
