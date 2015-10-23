'use strict';

describe('network-config', function() {

  const DEFAULT_NETWORKS = 2;

  var menuView = $('#menu-view');
  var configView = $('#config-view');
  var addNetworkButton = $('#add-network-button');
  var networkItems = $$('#network-list > li');
  var title = configView.$('gaia-header > h1');
  var saveButton = configView.$('button');
  var nameField = configView.$('[model="network.name"]');
  var autoConnectField = configView.$('[model="network.autoConnect"]');
  var hostField = configView.$('[model="network.host"]');
  var portField = configView.$('[model="network.port"]');
  var tlsField = configView.$('[model="network.tls"]');
  var nickField = configView.$('[model="network.nick"]');
  var userField = configView.$('[model="network.user"]');
  var passwordField = configView.$('[model="network.password"]');

  function fillInMinimalConfig() {
    nameField.setInputText('Test Name');
    hostField.setInputText('test.host');
    nickField.setInputText('test-nick');
  }

  function openNewNetwork() {
    menuView.evaluate('drawer.open = true; $digest();');
    addNetworkButton.click();
  }

  function editNetwork(index) {
    menuView.evaluate('drawer.open = true; $digest();');
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


  beforeAll(function() {
    browser.get('');
    this.helpers.setDefaultNetworks();
  });

  afterEach(function() {
    this.helpers.setDefaultNetworks();
  });

  beforeEach(function() {
    browser.get('');
  });

  describe('new network', function() {

    beforeEach(function() {
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

      expect(menuView.evaluate('networks[networks.length-1].name'))
          .toBe('Test Name');
      expect(menuView.evaluate('networks[networks.length-1].autoConnect'))
          .toBe(true);
      expect(menuView.evaluate('networks[networks.length-1].host'))
          .toBe('test.host');
      expect(menuView.evaluate('networks[networks.length-1].port'))
          .toBe(1234);
      expect(menuView.evaluate('networks[networks.length-1].tls'))
          .toBe(true);
      expect(menuView.evaluate('networks[networks.length-1].nick'))
          .toBe('test-nick');
      expect(menuView.evaluate('networks[networks.length-1].user'))
          .toBe('testuser');
      expect(menuView.evaluate('networks[networks.length-1].password'))
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
      expect(menuView.evaluate('networks[networks.length-1].port'))
          .toBe(6667);
    });

    it('should set the default tls port to 6697', function() {
      fillInMinimalConfig();
      tlsField.click();

      expect(portField.execute(function(port) {
        return port.els.input.getAttribute('placeholder');
      })).toBe('6697');

      saveButton.click();
      expect(menuView.evaluate('networks[networks.length-1].port'))
          .toBe(6697);
    });

  });

  describe('close action', function() {

    var confirmDialog = configView.$('gaia-dialog-confirm');

    function confirm() {
      confirmDialog.execute(function(dialog){
        /* global Event */
        dialog.els.submit.dispatchEvent(new Event('click'));
      });
    }

    it('should close a new network', function() {
      openNewNetwork();
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).not.toContain('config');
      expect(menuView.evaluate('networks.length')).toBe(DEFAULT_NETWORKS);
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
      expect(browser.getCurrentUrl()).not.toContain('config');
      expect(menuView.evaluate('networks.length')).toBe(DEFAULT_NETWORKS);
    });

    it('should show a warning for edited new network', function() {
      openNewNetwork();
      nameField.setInputText('Test Name');
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).toContain('config');
      confirm();
      expect(browser.getCurrentUrl()).not.toContain('config');
      expect(menuView.evaluate('networks.length')).toBe(DEFAULT_NETWORKS);
    });

    it('should close an existing network', function() {
      editNetwork(0);
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).not.toContain('config');
    });

    it('should show a warning for edited existing network', function() {
      editNetwork(0);
      nameField.setInputText('Test Name');
      configView.evaluate('onClose();');
      expect(browser.getCurrentUrl()).toContain('config');
      confirm();
      expect(browser.getCurrentUrl()).not.toContain('config');
      expect(menuView.evaluate('networks[0].name')).not.toBe('Test Name');
    });

  });

  describe('save action', function() {

    var alertDialog = configView.$('gaia-dialog-alert');

    it('should save when name is new', function() {
      expect(menuView.evaluate('networks.length')).toBe(2);
      openNewNetwork();
      fillInMinimalConfig();
      saveButton.click();
      expect(alertDialog.isPresent()).toBe(false);
      expect(menuView.evaluate('networks[2].name')).toBe('Test Name');
    });

    it('should show a dialog when name is taken', function() {
      openNewNetwork();
      fillInMinimalConfig();
      nameField.setInputText('Bar');
      expect(alertDialog.isDisplayed()).toBe(false);
      saveButton.click();
      expect(alertDialog.isPresent()).toBe(true);
      expect(alertDialog.isDisplayed()).toBe(true);
      expect(menuView.evaluate('networks.length')).toBe(2);
    });

  });

});
