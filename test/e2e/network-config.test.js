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

  function fillInMinimalConfig() {
    nameField.setInputText('Test Name');
    hostField.setInputText('test.host');
    nickField.setInputText('test-nick');
  }

  function openNewNetwork() {
    uiView.evaluate('drawer.open = true; $digest();');
    addNetworkButton.click();
  }

  function editNetwork(index) {
      uiView.evaluate('drawer.open = true; $digest();');
      var item;
      if (index === 'last') {
        item = networkItems.last();
      } else {
        item = networkItems.get(index);
      }
      var entry = item.$('div.network-entry');
      browser.actions()
          .mouseMove(entry)
          .click(protractor.Button.RIGHT)
          .perform();
      var editButton = $('[irc-dialog="networkDialog"]')
          .element(by.buttonText('Edit'));
      editButton.click();
  }

  describe('new network', function() {

    beforeEach(function() {
      browser.get('');
      openNewNetwork();
    });

    it('should open when clicking the "+" button', function() {
      expect(browser.getCurrentUrl()).toContain('config/network/');
    });

    it('should have the title "New Network"', function() {
      expect(title.getText()).toBe('New Network');
    });

    it('should have the correct defaults', function() {
      expect(nameField.getAttribute('value')).toBe('');
      expect(autoConnectField.getAttribute('checked')).toBeFalsy();
      expect(hostField.getAttribute('value')).toBe('');
      expect(portField.getAttribute('value')).toBe('');
      expect(tlsField.getAttribute('checked')).toBeFalsy();
      expect(nickField.getAttribute('value')).toBe('');
      expect(userField.getAttribute('value')).toBe('');
      expect(passwordField.getAttribute('value')).toBe('');
    });

    it('should save a new network', function() {
      nameField.setInputText('Test Name');
      autoConnectField.click();
      hostField.setInputText('test.host');
      portField.setInputText('1234');
      tlsField.click();
      nickField.setInputText('test-nick');
      userField.setInputText('testuser');
      passwordField.setInputText('testpass');

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

      editNetwork('last');

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
      fillInMinimalConfig();

      expect(portField.execute(function(port) {
        return port.els.input.getAttribute('placeholder');
      })).toBe('6667');

      saveButton.click();
      expect(uiView.evaluate('networks[networks.length-1].port'))
          .toBe(6667);
    });

    it('should set the default tls port to 6697', function() {
      fillInMinimalConfig();
      tlsField.click();

      expect(portField.execute(function(port) {
        return port.els.input.getAttribute('placeholder');
      })).toBe('6697');

      saveButton.click();
      expect(uiView.evaluate('networks[networks.length-1].port'))
          .toBe(6697);
    });

  });

  describe('close action', function() {

    var configView = element(by.css('[ui-view]'));
    var confirmButton = element(by.buttonText('Confirm'));

    beforeEach(function() {
      this.helpers.setDefaultNetworks();
      browser.get('');
    });

    it('should close a new network', function() {
      openNewNetwork();
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).toContain('show');
      expect(uiView.evaluate('networks.length')).toBe(DEFAULT_NETWORKS);
    });

    it('should close a new network when back to original state', function() {
      openNewNetwork();
      nameField.setInputText('Test Name');
      nameField.setInputText('');
      userField.setInputText('testuser');
      userField.setInputText('');
      tlsField.click();
      tlsField.click();
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).toContain('show');
      expect(uiView.evaluate('networks.length')).toBe(DEFAULT_NETWORKS);
    });

    it('should show a warning for edited new network', function() {
      openNewNetwork();
      nameField.setInputText('Test Name');
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).toContain('config');
      configView.evaluate('confirmDialog.onConfirm();');
      expect(browser.getCurrentUrl()).toContain('show');
      expect(uiView.evaluate('networks.length')).toBe(DEFAULT_NETWORKS);
    });

    it('should close an existing network', function() {
      editNetwork(0);
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).toContain('show');
    });

    it('should show a warning for edited existing network', function() {
      editNetwork(0);
      nameField.setInputText('Test Name');
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).toContain('config');
      configView.evaluate('confirmDialog.onConfirm();');
      expect(browser.getCurrentUrl()).toContain('show');
      expect(uiView.evaluate('networks[0].name')).not.toBe('Test Name');
    });

  });

});
