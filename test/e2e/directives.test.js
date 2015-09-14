'use strict';

describe('gaia-checkbox', function() {

  var gaiaCheckbox = element(by.css('gaia-checkbox'));
  var checkbox = element(by.css('input'));

  beforeEach(function() {
    browser.get('/test/e2e/html/checkbox.html');
  });

  it('should update its value', function() {
    expect(gaiaCheckbox.getAttribute('checked')).toBeFalsy();
    checkbox.click();
    expect(gaiaCheckbox.getAttribute('checked')).toBeTruthy();
    checkbox.click();
    expect(gaiaCheckbox.getAttribute('checked')).toBeFalsy();
  });

  it('should update the model', function() {
    expect(checkbox.getAttribute('checked')).toBeFalsy();
    gaiaCheckbox.click();
    expect(checkbox.getAttribute('checked')).toBeTruthy();
    gaiaCheckbox.click();
    expect(checkbox.getAttribute('checked')).toBeFalsy();
  });

});

describe('gaia-dialog-select', function() {

  var dialog = element(by.css('gaia-dialog-select'));
  var monitor = element(by.css('div'));
  var foo = dialog.element(by.cssContainingText('li', 'foo'));
  var bar = dialog.element(by.cssContainingText('li', 'bar'));

  beforeEach(function() {
    browser.get('/test/e2e/html/dialog-select.html');
  });

  it('should update the selection', function() {
    dialog.evaluate('dialog.open()');
    expect(foo.getAttribute('aria-selected')).toBeFalsy();
    expect(bar.getAttribute('aria-selected')).toBeFalsy();
    dialog.evaluate('selection = "bar"; $digest()');
    expect(foo.getAttribute('aria-selected')).toBeFalsy();
    expect(bar.getAttribute('aria-selected')).toBeTruthy();
    dialog.evaluate('selection = "foo"; $digest()');
    expect(foo.getAttribute('aria-selected')).toBeTruthy();
    expect(bar.getAttribute('aria-selected')).toBeFalsy();
  });

  it('should update the model', function() {
    expect(monitor.getText()).toBe('');
    dialog.evaluate('dialog.open()');
    foo.click();
    expect(monitor.getText()).toBe('foo');
    dialog.evaluate('dialog.open()');
    bar.click();
    expect(monitor.getText()).toBe('bar');
  });

});
