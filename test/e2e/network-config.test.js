'use strict';

describe('network-config', function() {

  const DEFAULT_NETWORKS = 2;

  var uiView = element(by.css('[ui-view=menu]'));
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

  function fillInMinimalConfig() {
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
      var nick = document.querySelector('[model="network.nick"]');
      nick.value = 'test-nick';
      nick.els.input.dispatchEvent(new CustomEvent('input'));
    });
  }

  it('should save a new network', function() {
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

    expect(uiView.evaluate('networks[networks.length-1].name'))
        .toBe('Test Name');
    expect(uiView.evaluate('networks[networks.length-1].autoConnect'))
        .toBe(true);
    expect(uiView.evaluate('networks[networks.length-1].host'))
        .toBe('test.host');
    expect(uiView.evaluate('networks[networks.length-1].port'))
        .toBe(1234);
    expect(uiView.evaluate('networks[networks.length-1].tls'))
        .toBe(true);
    expect(uiView.evaluate('networks[networks.length-1].nick'))
        .toBe('test-nick');
    expect(uiView.evaluate('networks[networks.length-1].user'))
        .toBe('testuser');
    expect(uiView.evaluate('networks[networks.length-1].password'))
        .toBe('testpass');

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

  it('should set the default port to 6667', function() {
    browser.get('#/config/network/');
    fillInMinimalConfig();
    expect(browser.executeScript(function() {
      var port = document.querySelector('[model="network.port"]');
      return port.els.input.getAttribute('placeholder');
    })).toBe('6667');
    saveButton.click();
    expect(uiView.evaluate('networks[networks.length-1].port'))
        .toBe(6667);
  });

  it('should set the default tls port to 6697', function() {
    browser.get('#/config/network/');
    fillInMinimalConfig();
    tlsField.click();
    expect(browser.executeScript(function() {
      var port = document.querySelector('[model="network.port"]');
      return port.els.input.getAttribute('placeholder');
    })).toBe('6697');
    saveButton.click();
    expect(uiView.evaluate('networks[networks.length-1].port'))
        .toBe(6697);
  });

  describe('close action', function() {

    var configView = element(by.css('[ui-view]'));
    var confirmButton = element(by.buttonText('Confirm'));

    beforeEach(function() {
      this.helpers.setDefaultNetworks();
    });

    it('should close a new network', function() {
      browser.get('#/config/network/');
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).toContain('show');
      expect(uiView.evaluate('networks.length')).toBe(DEFAULT_NETWORKS);
    });

    it('should show a warning for edited new network', function() {
      browser.get('#/config/network/');
      browser.executeScript(function() {
        /* global document, CustomEvent*/
        var name = document.querySelector('[model="network.name"]');
        name.value = 'Test Name';
        name.els.input.dispatchEvent(new CustomEvent('input'));
      });
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).toContain('config');
      configView.evaluate('confirmDialog.onConfirm();');
      expect(browser.getCurrentUrl()).toContain('show');
      expect(uiView.evaluate('networks.length')).toBe(DEFAULT_NETWORKS);
    });

    it('should close an existing network', function() {
      browser.get('#/config/network/0');
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).toContain('show');
    });

    it('should show a warning for edited existing network', function() {
      browser.get('#/config/network/0');
      browser.executeScript(function() {
        /* global document, CustomEvent*/
        var name = document.querySelector('[model="network.name"]');
        name.value = 'Test Name';
        name.els.input.dispatchEvent(new CustomEvent('input'));
      });
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).toContain('config');
      configView.evaluate('confirmDialog.onConfirm();');
      expect(browser.getCurrentUrl()).toContain('show');
      expect(uiView.evaluate('networks[0].name')).not.toBe('Test Name');
    });

  });

});
