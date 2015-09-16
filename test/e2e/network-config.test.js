'use strict';

describe('network-config', function() {

  var uiView = element(by.css('body > div'));
  var addNetworkButton = element(by.css('#add-network-button'));
  var networkItems = element.all(by.css('#network-list > li'));
  var title = element(by.css('h1'));
  var saveButton = element(by.css('button'));
  var nameField = element(by.css('[model="network.name"]'));
  var autoConnectField = element(by.css('[model="network.autoConnect"]'));
  var hostField = element(by.css('[model="network.host"]'));
  var portField = element(by.css('[model="network.port"]'));
  var tlsField = element(by.css('[model="network.tls"]'));
  var nickField = element(by.css('[model="network.nick"]'));
  var userField = element(by.css('[model="network.user"]'));
  var passwordField = element(by.css('[model="network.password"]'));

  it('should open when clicking the "+" button', function() {
    browser.get('');
    uiView.evaluate('drawer.open = true; $digest();');
    addNetworkButton.click();
    expect(browser.getCurrentUrl()).toContain('config/network/');
  });

  describe('new network', function() {

    beforeAll(function() {
      browser.get('#/config/network/');
    });

    it('should have the title "New Network"', function() {
      expect(title.getText()).toBe('New Network');
    });

    it('should have an empty name field', function() {
      expect(nameField.getAttribute('value')).toBe('');
    });

    it('should have "Auto Connect" unchecked', function() {
      expect(autoConnectField.getAttribute('checked')).toBeFalsy();
    });

  });

  it('should save a new network', function() {
    // TODO: test config getter on network object
    browser.get('#/config/network/');
    browser.executeScript(function() {
      /* global document, CustomEvent*/
      var name = document.querySelector('[model="network.name"]');
      name.value = 'Test Name';
      name.els.input.dispatchEvent(new CustomEvent('input'));
      document.querySelector('[model="network.autoConnect"]')
          .click();
      var host = document.querySelector('[model="network.host"]');
      host.value = 'test.host';
      host.els.input.dispatchEvent(new CustomEvent('input'));
      var port = document.querySelector('[model="network.port"]');
      port.value = '1234';
      port.els.input.dispatchEvent(new CustomEvent('input'));
      document.querySelector('[model="network.tls"]')
          .click();
      var nick = document.querySelector('[model="network.nick"]');
      nick.value = 'test-nick';
      nick.els.input.dispatchEvent(new CustomEvent('input'));
      var user = document.querySelector('[model="network.user"]');
      user.value = 'testuser';
      user.els.input.dispatchEvent(new CustomEvent('input'));
      var password = document.querySelector('[model="network.password"]');
      password.value = 'testpass';
      password.els.input.dispatchEvent(new CustomEvent('input'));
    });
    saveButton.click();

    uiView.evaluate('drawer.open = true; $digest();');
    var entry = networkItems.last().element(by.css('div.network-entry'));
    browser.actions()
        .mouseMove(entry)
        .click(protractor.Button.RIGHT)
        .perform();
    var editButton = element.all(by.buttonText('Edit')).last();
    editButton.click();

    expect(nameField.getAttribute('value')).toBe('Test Name');
    expect(autoConnectField.getAttribute('checked')).toBe('true');
    expect(hostField.getAttribute('value')).toBe('test.host');
    expect(portField.getAttribute('value')).toBe('1234');
    expect(tlsField.getAttribute('checked')).toBe('true');
    expect(nickField.getAttribute('value')).toBe('test-nick');
    expect(userField.getAttribute('value')).toBe('testuser');
    expect(passwordField.getAttribute('value')).toBe('testpass');
  });

});
