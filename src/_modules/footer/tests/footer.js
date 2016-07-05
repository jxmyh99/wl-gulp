/*eslint no-unused-expressions:0 */
'use strict';

import footer1 from '../footer';

describe('footer1 View', function() {

  beforeEach(() => {
    this.footer = new footer1();
  });

  it('Should run a few assertions', () => {
    expect(this.footer).to.exist;
  });

});
