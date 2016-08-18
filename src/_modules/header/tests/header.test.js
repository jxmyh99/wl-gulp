/*eslint no-unused-expressions:0 */
'use strict';

import header1 from '../header';

describe('header1 View', function() {

  beforeEach(() => {
    this.header = new header1();
  });

  it('Should run a few assertions', () => {
    expect(this.header).to.exist;
  });

});
