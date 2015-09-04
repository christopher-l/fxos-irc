'use strict';

describe('network-list', function() {

  var header = element(by.css('gaia-header'));
  var networkList = element(by.css('#network-list'));
  var networkEntry = networkList.all(by.css('li')).first();

  var clickMenuButton = function() {
    browser.actions()
      .mouseMove(header, {x: 20, y: 20})
      .mouseDown()
      .mouseUp()
      .perform();
  };

  beforeEach(function() {
    browser.get('');
    clickMenuButton();
  });

  it('should have an entry', function() {
    expect(networkEntry.isPresent).toBeTruthy();
  });

  describe('entry', function() {

    var collapseIndicator = networkEntry.element(by.css('.collapse-indicator'));
    var channelList = networkEntry.element(by.css('.channel-list'));

    it('should have a channel list', function() {
      expect(channelList.isPresent).toBeTruthy();
    });

    it('should have a collapse indicator', function() {
      expect(collapseIndicator.isPresent).toBeTruthy();
    });

    it('should be expanded', function() {
      expect(networkEntry.getAttribute('collapsed')).toBeNull();
      expect(channelList.getCssValue('height')).not.toBe('0px');
    });

    it('should collapsed when clicking the indicator', function() {
      collapseIndicator.click();
      expect(networkEntry.getAttribute('collapsed')).toBeTruthy();
      expect(channelList.getCssValue('height')).toBe('0px');
    });

    it('should expand when clicking the indicator a second time', function() {
      collapseIndicator.click();
      expect(networkEntry.getAttribute('collapsed')).toBeTruthy();
      collapseIndicator.click();
      expect(networkEntry.getAttribute('collapsed')).toBeFalsy();
      expect(channelList.getCssValue('height')).not.toBe('0px');
    });

  });

});
