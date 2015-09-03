'use strict';

describe('drawer', function() {

  var body = element(by.css('body'));
  var drawer = element(by.css('gaia-drawer'));
  var header = element(by.css('gaia-header'));

  beforeAll(function() {
    var width = 360;
    var height = 640;
    browser.driver.manage().window().setSize(width, height);
  });

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

  it('should open with menu button after closing by clicking beneath', function() {
    clickMenuButton();
    clickBottom();
    expect(drawer.getAttribute('open')).toBeFalsy();
    clickMenuButton();
    expect(drawer.getAttribute('open')).toBeTruthy();
  });

});
