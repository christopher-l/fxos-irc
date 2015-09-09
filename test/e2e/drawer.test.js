'use strict';

describe('drawer', function() {

  var body = element(by.css('body'));
  var uiView = element(by.css('body > div'));
  var drawer = element(by.css('gaia-drawer'));
  var header = element(by.css('gaia-header'));

  beforeEach(function() {
    browser.get('');
  });

  var clickMenuButton = function() {
    browser.actions()
      .mouseMove(header, {x: 20, y: 20})
      .mouseDown()
      .mouseUp()
      .perform();
  };

  var clickBottom = function() {
    body.getSize().then(function(size) {
      browser.actions()
        .mouseMove(body, {x: 100, y: size.height - 10})
        .mouseDown()
        .mouseUp()
        .perform();
    });
  };

  it('should be there', function() {
    expect(drawer.isPresent()).toBeTruthy();
    expect(header.isPresent()).toBeTruthy();
  });

  it('should open when clicking the menu button', function() {
    expect(drawer.getAttribute('open')).toBeFalsy();
    clickMenuButton();
    expect(drawer.getAttribute('open')).toBeTruthy();
  });

  it('should close when clicking the menu button again', function() {
    clickMenuButton();
    expect(drawer.getAttribute('open')).toBeTruthy();
    clickMenuButton();
    expect(drawer.getAttribute('open')).toBeFalsy();
  });

  it('should close when clicking the blurred area beneath it', function() {
    clickBottom();
    expect(drawer.getAttribute('open')).toBeFalsy();
    clickMenuButton();
    expect(drawer.getAttribute('open')).toBeTruthy();
    clickBottom();
    expect(drawer.getAttribute('open')).toBeFalsy();
  });

  it('should still open after closing by clicking beneath', function() {
    clickMenuButton();
    clickBottom();
    expect(drawer.getAttribute('open')).toBeFalsy();
    clickMenuButton();
    expect(drawer.getAttribute('open')).toBeTruthy();
  });

  it('should update the scope variable', function() {
    expect(uiView.evaluate('drawer.open')).toBeFalsy();
    clickMenuButton();
    expect(uiView.evaluate('drawer.open')).toBeTruthy();
    clickBottom();
    expect(uiView.evaluate('drawer.open')).toBeFalsy();
  });

  it('should update as the scope variable changes', function() {
    expect(uiView.evaluate('drawer.open')).toBeFalsy();
    uiView.evaluate('drawer.open = true; $digest();');
    expect(uiView.evaluate('drawer.open')).toBeTruthy();
    expect(drawer.getAttribute('open')).toBeTruthy();
  });

});
