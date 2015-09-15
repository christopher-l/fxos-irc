'use strict';

describe('settings', function() {

  var uiView = element(by.css('body > div'));
  var doneButton = element(by.css('gaia-header button'));
  var settingsButton = element(by.css('gaia-button#settings-button'));
  var themeSwitch = element(by.css('gaia-switch'));
  var fontSizeSlider = element(by.css('[model="settings.fontSize"]'));
  var fontSizeOutput = fontSizeSlider.element(by.css('output'));
  var onStartupSelector = element(by.binding('onStartupDialog.currentText'));
  var onStartupDialog = element(by.css('[irc-dialog=onStartupDialog]'));
  var resetState = onStartupDialog.element(
      by.cssContainingText('li', 'Reset State'));
  var restoreState = onStartupDialog.element(
      by.cssContainingText('li', 'Restore Last State'));

  var get = function(identifier) {
    var deferred = protractor.promise.defer();
    browser.executeScript('return JSON.stringify(' + identifier + ')')
        .then(function(localStorage) {
          deferred.fulfill(JSON.parse(localStorage));
        });
    return deferred.promise;
  };

  beforeAll(function() {
    browser.get('#/settings');
    browser.executeScript(function() {
      /* global localStorage */
      localStorage.removeItem('settings');
    });
  });

  beforeEach(function() {
    browser.get('#/settings');
  });

  it('should open when clicking the settings button', function() {
    browser.get('');
    expect(browser.getCurrentUrl()).not.toContain('#/settings');
    uiView.evaluate('drawer.open = true; $digest();');
    settingsButton.click();
    expect(browser.getCurrentUrl()).toContain('#/settings');
  });

  it('should load the defaults', function() {
    expect(themeSwitch.getAttribute('checked')).toBeFalsy();
    expect(fontSizeOutput.getText()).toBe('12');
    expect(onStartupSelector.getText()).toBe('Reset State');
    onStartupSelector.click();
    expect(resetState.getAttribute('aria-selected')).toBeTruthy();
    expect(restoreState.getAttribute('aria-selected')).toBeFalsy();
  });

  it('should save to localStorage', function() {
    get('window.localStorage').then(function(localStorage) {
      expect(localStorage.settings).toBeTruthy();
      var settings = JSON.parse(localStorage.settings);
      expect(settings.fontSize).toBe(12);
      expect(settings.darkTheme).toBe(false);
      expect(settings.onStartup).toBe('reset');
    });
    themeSwitch.click();
    onStartupSelector.click();
    restoreState.click();
    doneButton.click();
    get('window.localStorage').then(function(localStorage) {
      expect(localStorage.settings).toBeTruthy();
      var settings = JSON.parse(localStorage.settings);
      expect(settings.fontSize).toBe(12);
      expect(settings.darkTheme).toBe(true);
      expect(settings.onStartup).toBe('restore');
    });
  });

  it('should load the settings', function() {
    expect(themeSwitch.getAttribute('checked')).toBeTruthy();
    expect(fontSizeOutput.getText()).toBe('12');
    expect(onStartupSelector.getText()).toBe('Restore Last State');
    onStartupSelector.click();
    expect(resetState.getAttribute('aria-selected')).toBeFalsy();
    expect(restoreState.getAttribute('aria-selected')).toBeTruthy();
  });

});
