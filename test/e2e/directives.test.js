'use strict';

describe('irc-slider', function() {

  var ircSlider = element(by.css('irc-slider'));
  var gaiaSlider = element(by.css('gaia-slider'));
  var output = ircSlider.element(by.css('output'));
  var monitor = element(by.css('div'));

  beforeEach(function() {
    browser.get('/test/e2e/html/slider.html');
  });

  it('should update the slider', function() {
    ircSlider.evaluate('bananas = 5; $digest();');
    expect(browser.executeScript(function() {
      /* global document */
      var el = document.querySelector('gaia-slider');
      return el.shadowRoot.querySelector('input').value;
    })).toBe('5');
    expect(output.getText()).toBe('5');
  });

  it('should update the model', function() {
    browser.executeScript(function() {
      /* global CustomEvent */
      var el = document.querySelector('gaia-slider');
      var input = el.shadowRoot.querySelector('input');
      input.value = 28;
      input.dispatchEvent(new CustomEvent('input'));
    });
    expect(monitor.getText()).toBe('28');
    expect(output.getText()).toBe('28');
  });

});

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
  var valueMonitor = element(by.css('div.value'));
  var textMonitor = element(by.css('div.text'));
  var foo = dialog.element(by.cssContainingText('li', 'Foo!'));
  var bar = dialog.element(by.cssContainingText('li', 'Bar!'));

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
    expect(valueMonitor.getText()).toBe('');
    dialog.evaluate('dialog.open()');
    foo.click();
    expect(valueMonitor.getText()).toBe('foo');
    dialog.evaluate('dialog.open()');
    bar.click();
    expect(valueMonitor.getText()).toBe('bar');
  });

  it('shoudl update currentText', function() {
    dialog.evaluate('dialog.open()');
    foo.click();
    expect(textMonitor.getText()).toBe('Foo!');
    dialog.evaluate('selection = "bar"; $digest()');
    expect(textMonitor.getText()).toBe('Bar!');
  });

});
