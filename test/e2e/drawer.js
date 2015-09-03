'use strict';

describe('drawer', function() {

  var drawer = element(by.css('gaia-drawer'));
  var header = element(by.css('gaia-header'));

  beforeEach(function() {
    browser.get('');
  });

  it('should be there', function() {
    expect(drawer.isPresent()).toBeTruthy();
    expect(header.isPresent()).toBeTruthy();
  });

  it('should open when clicking the menu button', function() {
    expect(drawer.getAttribute('open')).toBeFalsy();
    browser.actions()
      .mouseMove(header, {x: 20, y: 20})
      .mouseDown()
      .mouseUp()
      .perform();
    expect(drawer.getAttribute('open')).toBeTruthy();
  });
});
