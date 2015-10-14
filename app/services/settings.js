'use strict';

var settings = angular.module('irc.settings', [
  'irc.storage'
]);


/**
 * Settings Service
 *
 * Properties:
 *   data:       Object on which the settings lie as properties.
 *   save():     Write settings to localStorage.
 *   apply():    Apply changes and save.
 *   register(): Register a function that will be called as soon a setting
 *               changes.  Also gets called initially after registration.
 *               It takes the following arguments:
 *     prop: The settings property to listen for.
 *     fn:   The function to call on a change.  fn will be passed the
 *           new value of the property it registered for.
 */
settings.factory('settings', ['$rootScope', 'Storage',
    function settingsFactory($rootScope, Storage) {

  var settings = new Storage('settings', {
    darkTheme: false,
    fontSize: 12,
  });

  var listeners = {};
  for (var prop in settings.data) {
    listeners[prop] = [];
  }

  settings.apply = function(newVal, oldVal) {
    for (var prop in listeners) {
      if (newVal[prop] !== oldVal[prop]) {
        listeners[prop].forEach(fn => fn(newVal[prop]));
      }
    }
    settings.save();
  };

  settings.register = function(prop, fn) {
    listeners[prop].push(fn);
    fn(settings.data[prop]);
  };

  return settings;

}]);


/**
 * Theme Service
 *
 * Registeres itself on the darkTheme settings property.
 *
 * Exposes the following properties:
 *   group:  String that can be used as css class and in html header.  E.g.
 *           'theme-communications'.
 *   color:  String intendet for use in html header to set the color of the
 *           status bar.
 *
 * Provides the following means of setting the theme:
 *   setThemeClass(): Change between main and settings theme.  Takes a String
 *                    that should either be 'main' or 'settings'.
 *   titleScope:      Property to be set externally.  Will $digest on theme
 *                    change.
 */
settings.service('theme', ['settings', function Theme(settings) {

  var self = this;

  var lightTheme = {
    main: 'theme-communications',
    settings: 'theme-settings'
  };

  var darkTheme = {
    main: 'theme-media',
    settings: 'theme-media'
  };

  var currentTheme;
  var themeClass;

  settings.register('darkTheme', function(value) {
    currentTheme = value ? darkTheme : lightTheme;
    if (self.titleScope) {
      setTimeout(() => self.titleScope.$digest());
    }
  });

  this.setThemeClass = function(value) {
    themeClass = value;
  };

  this.setThemeClass('main');

  Object.defineProperties(this, {
    'group': {
      get: function() {
        return currentTheme[themeClass];
      }
    },
    'color': {
      value: 'var(--header-background)'
    },
    // TODO document
    'main': {
      get: function() {
        return currentTheme.main;
      }
    },
    'settings': {
      get: function() {
        return currentTheme.settings;
      }
    },
  });

}]);
