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
