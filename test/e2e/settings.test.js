'use strict';

describe('settings', function() {

  var uiView = element(by.css('body > div'));
  var doneButton = element(by.css('gaia-header button'));
  var settingsButton = element(by.css('gaia-button#settings-button'));

  var get = function(identifier) {
    var deferred = protractor.promise.defer();
    browser.executeScript('return JSON.stringify(' + identifier + ')')
        .then(function(localStorage) {
          deferred.fulfill(JSON.parse(localStorage));
        });
    return deferred.promise;
  };

  beforeEach(function() {
    browser.get('#/settings');
  });

  it('should save to localStorage on exit', function() {
    expect(get('window.localStorage')).toEqual({});
    doneButton.click();
    get('window.localStorage').then(function(localStorage) {
      expect(localStorage['irc-settings']).toBeTruthy();
      var settings = JSON.parse(localStorage['irc-settings']);
      expect(settings.fontSize).toBe(12);
      expect(settings.darkTheme).toBe(false);
    });
  });

  it('should open when clicking the settings button', function() {
    browser.get('');
    expect(browser.getCurrentUrl()).not.toContain('#/settings');
    uiView.evaluate('drawerOpen = true; $digest();');
    settingsButton.click();
    expect(browser.getCurrentUrl()).toContain('#/settings');
  });

});
