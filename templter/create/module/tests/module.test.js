/*eslint no-unused-expressions:0 */
'use strict';

import module1 from '../module';

describe('module1 View', function() {

  beforeEach(() => {
    this.module = new module1();
  });

  it('Should run a few assertions', () => {
    expect(this.module).to.exist;
  });

});
