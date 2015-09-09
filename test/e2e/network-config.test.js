'use strict';

describe('network-config', function() {

  var uiView = element(by.css('body > div'));
  var addNetworkButton = element(by.css('#add-network-button'));
  var title = element(by.css('h1'));
  var nameField = element.all(by.css('gaia-text-input')).first();
  var autoConnect = element.all(by.css('gaia-checkbox')).first();

  it('should open when clicking the "+" button', function() {
    browser.get('');
    uiView.evaluate('drawer.open = true; $digest();');
    addNetworkButton.click();
    expect(browser.getCurrentUrl()).toContain('config/network/');
  });

  describe('new network', function() {

    beforeEach(function() {
      browser.get('#/config/network/');
    });

    it('should have the title "New Network"', function() {
      expect(title.getText()).toBe('New Network');
    });

    it('should have an empty name field', function() {
      expect(nameField.getAttribute('value')).toBe('');
    });

    it('should have "Auto Connect" unchecked', function() {
      browser.sleep(3000);
      expect(autoConnect.getAttribute('checked')).toBeFalsy();
    });

  });

});
