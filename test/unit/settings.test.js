'use strict';

describe('settings', function() {

  var settings;
  var mock;

  beforeEach(module('irc.settings'));

  beforeEach(function() {
    mock = {
      localStorage: {}
    };
    module(function($provide) {
      $provide.value('$window', mock);
    });
  });

  var load = function() {
    inject(function($injector) {
      settings = $injector.get('settings');
    });
  };

  it('should load the defaults', function() {
    load();
    expect(settings.data.darkTheme).toBe(false);
    expect(settings.data.fontSize).toBe(12);
  });

  it('should save to localStorage', function() {
    load();
    settings.data.darkTheme = true;
    settings.data.fontSize = 17;
    settings.save();
    expect(mock.localStorage.settings).toBe(angular.toJson(settings.data));
  });

  it('should load from localStorage', function() {
    mock.localStorage.settings = '{"darkTheme":true,"fontSize":17}';
    load();
    expect(settings.data.darkTheme).toBe(true);
    expect(settings.data.fontSize).toBe(17);
  });

});
