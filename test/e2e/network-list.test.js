'use strict';

describe('network-list', function() {

  var uiView = element(by.css('body > div'));
  var header = element(by.css('gaia-header'));
  var networkList = element(by.css('#network-list'));
  var networkItem = networkList.all(by.css('li')).first();

  beforeEach(function() {
    browser.get('');
    uiView.evaluate('drawerOpen = true; $digest();');
  });

  it('should have an entry', function() {
    expect(networkItem.isPresent).toBeTruthy();
  });

  describe('entry', function() {

    var collapseIndicator = networkItem.element(by.css('.collapse-indicator'));
    var channelList = networkItem.element(by.css('.channel-list'));

    it('should have a channel list', function() {
      expect(channelList.isPresent).toBeTruthy();
    });

    it('should have a collapse indeicator', function() {
      expect(collapseIndicator.isPresent).toBeTruthy();
    });

    it('should have a collapse indicator', function() {
      expect(collapseIndicator.isPresent).toBeTruthy();
    });

    it('should be expanded', function() {
      expect(networkItem.getAttribute('collapsed')).toBeNull();
      expect(channelList.getCssValue('height')).not.toBe('0px');
    });

    it('should collapsed when clicking the indicator', function() {
      collapseIndicator.click();
      expect(networkItem.getAttribute('collapsed')).toBeTruthy();
      expect(channelList.getCssValue('height')).toBe('0px');
    });

    it('should expand when clicking the indicator a second time', function() {
      collapseIndicator.click();
      expect(networkItem.getAttribute('collapsed')).toBeTruthy();
      collapseIndicator.click();
      expect(networkItem.getAttribute('collapsed')).toBeFalsy();
      expect(channelList.getCssValue('height')).not.toBe('0px');
    });

  });

});
