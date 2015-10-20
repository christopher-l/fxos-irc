'use strict';

describe('channel-config', function() {

  var menuView = $('#menu-view');
  var configView = $('#config-view');
  var addChannelButton = $('#add-channel-button');
  var title = configView.$('gaia-header > h1');
  var saveButton = configView.$('button');
  var networkField = configView.$('gaia-value-selector');
  var nameField = configView.$('[model="channel.name"]');
  var autoJoinField = configView.$('[model="channel.autoJoin"]');

  var self;
  var newChannelUrl = '#/config/channel//';

  function openNewChannel() {
    browser.get(newChannelUrl);
  }

  function isConfigOpen() {
    var deferred = protractor.promise.defer();
    browser.getCurrentUrl().then(function(url) {
      var result = url.includes('#/config/channel/');
      deferred.fulfill(result);
    });
    return deferred.promise;
  }

  function editChannel(network, channel) {
    browser.get('#/config/channel/' + network + '/' + channel);
  }

  beforeAll(function() {
    self = this;
    browser.get('');
    this.helpers.setDefaultNetworks();
  });

  afterEach(function() {
    this.helpers.setDefaultNetworks();
  });


  describe('new channel', function() {

    beforeEach(function() {
      openNewChannel();
    });

    it('should open when clicking the "#" button', function() {
      browser.get('');
      expect(isConfigOpen()).toBe(false);
      this.helpers.clickHeaderActionButton();
      addChannelButton.click();
      expect(isConfigOpen()).toBe(true);
      expect(browser.getCurrentUrl()).toContain(newChannelUrl);
    });

    it('should have the title "New Channel"', function() {
      expect(title.getText()).toBe('New Channel');
    });

    it('should have the correct defaults', function() {
      expect(networkField.getText()).toBe('Foo');
      expect(nameField.getAttribute('value')).toBe('');
      expect(autoJoinField.getAttribute('checked')).toBeFalsy();
    });

    it('should save a channel', function() {
      nameField.setInputText('test-channel');
      autoJoinField.click();

      saveButton.click();

      // channel._config
      menuView.execute(function(element) {
        var el = angular.element(element);
        var scope = el.scope();
        var network = scope.networks[0];
        var numChannels = network.channels.length;
        var channel = network.channels[numChannels-1];
        return JSON.stringify(channel._config);
      }).then(function(value) {
        var channelConfig = JSON.parse(value);
        expect(channelConfig).toEqual({
          name: 'test-channel',
          autoJoin: true,
        });
      });

      // config getters
      expect(menuView.evaluate('networks[0].channels[2].name'))
          .toBe('test-channel');
      expect(menuView.evaluate('networks[0].channels[2].autoJoin'))
          .toBeTruthy();
    });

    it('should save a channel to a chosen network', function() {
      networkField.click();
      expect($('gaia-dialog-select').isDisplayed()).toBe(true);
      configView.element(by.cssContainingText('li', 'Bar')).click();

      nameField.setInputText('bar-channel');
      autoJoinField.click();

      saveButton.click();

      expect(menuView.evaluate('networks[1].channels[2].name'))
          .toBe('bar-channel');
    });

  });

  it('should edit an existing channel', function() {
    browser.get('');
    this.helpers.clickHeaderActionButton();
    browser.actions()
        .mouseMove(element(by.cssContainingText('.channel-name', 'channel3')))
        .click(protractor.Button.RIGHT)
        .perform();
    $('[irc-dialog="channelDialog"]').element(by.buttonText('Edit')).click();

    expect(networkField.getText()).toBe('Bar');
    expect(nameField.getAttribute('value')).toBe('channel3');
    expect(autoJoinField.getAttribute('checked')).toBeTruthy();

    networkField.click();
    expect($('gaia-dialog-select').isDisplayed()).toBe(false);
    expect(networkField.getCssValue('opacity')).toBe('0.5');

    nameField.setInputText('channel3-new');
    saveButton.click();

    expect(menuView.evaluate('networks[1].channels[0].name'))
        .toBe('channel3-new');
  });


  describe('close action', function() {

    var confirmDialog = configView.$('gaia-dialog-confirm');

    function close() {
      configView.evaluate('onClose();');
    }

    function confirm() {
      confirmDialog.execute(function(dialog){
        /* global Event */
        dialog.els.submit.dispatchEvent(new Event('click'));
      });
    }

    beforeEach(function() {
      this.helpers.setDefaultNetworks();
    });

    it('should close a new channel', function() {
      openNewChannel();
      close();
      expect(isConfigOpen()).toBe(false);
      expect(menuView.evaluate('networks[0].channels.length')).toBe(2);
    });

    it('should close a new channel when back to original state', function() {
      openNewChannel();
      nameField.setInputText('testchannel');
      nameField.setInputText('');
      autoJoinField.click();
      autoJoinField.click();
      close();
      expect(isConfigOpen()).toBe(false);
      expect(menuView.evaluate('networks[0].channels.length')).toBe(2);
    });

    it('should show a warning for edited new channel', function() {
      openNewChannel();
      nameField.setInputText('testchannel');
      close();
      expect(isConfigOpen()).toBe(true);
      confirm();
      expect(isConfigOpen()).toBe(false);
      expect(menuView.evaluate('networks[0].channels.length')).toBe(2);
    });

    it('should close an existing channel', function() {
      editChannel('Foo', 'channel1');
      expect(isConfigOpen()).toBe(true);
      close();
      expect(isConfigOpen()).toBe(false);
    });

    it('should show a warning for edited existing channel', function() {
      editChannel('Foo', 'channel1');
      nameField.setInputText('testchannel');
      close();
      expect(isConfigOpen()).toBe(true);
      confirm();
      expect(isConfigOpen()).toBe(false);
      expect(menuView.evaluate('networks[0].channels[0].name'))
          .toBe('channel1');
    });


  });

});
