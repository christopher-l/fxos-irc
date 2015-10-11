'use strict';

fdescribe('channel-config', function() {

  var menuView = $('[ui-view="menu"]');
  var addChannelButton = $('#add-channel-button');
  var title = $('gaia-header > h1');
  var saveButton = $('button');
  var networkField = $('gaia-value-selector');
  var nameField = $('[model="channel.name"]');
  var autoJoinField = $('[model="channel.autoJoin"]');

  beforeAll(function() {
    this.helpers.setDefaultNetworks();
  });

  it('should open when clicking the "#" button', function() {
    browser.get('');
    this.helpers.clickHeaderActionButton();
    addChannelButton.click();
    expect(browser.getCurrentUrl()).toContain('config/channel/');
  });

  describe('new channel', function() {

    beforeEach(function() {
      browser.get('#/config/channel//');
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
      element(by.cssContainingText('li', 'Bar')).click();

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

});
