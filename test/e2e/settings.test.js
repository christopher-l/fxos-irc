'use strict';

describe('settings', function() {

  var uiView = element(by.css('body > div'));
  var doneButton = element(by.css('gaia-header button'));
  var settingsButton = element(by.css('gaia-button#settings-button'));
  var themeSwitch = element(by.css('gaia-switch'));

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

  it('should save to localStorage', function() {
    get('window.localStorage').then(function(localStorage) {
      expect(localStorage.settings).toBeTruthy();
      var settings = JSON.parse(localStorage.settings);
      expect(settings.fontSize).toBe(12);
      expect(settings.darkTheme).toBe(false);
    });
    themeSwitch.click();
    doneButton.click();
    get('window.localStorage').then(function(localStorage) {
      expect(localStorage.settings).toBeTruthy();
      var settings = JSON.parse(localStorage.settings);
      expect(settings.fontSize).toBe(12);
      expect(settings.darkTheme).toBe(true);
    });
  });

  it('should open when clicking the settings button', function() {
    browser.get('');
    expect(browser.getCurrentUrl()).not.toContain('#/settings');
    uiView.evaluate('drawer.open = true; $digest();');
    settingsButton.click();
    expect(browser.getCurrentUrl()).toContain('#/settings');
  });

  it('should load the settings', function() {
    expect(themeSwitch.getAttribute('checked')).toBeTruthy();
  });

});
