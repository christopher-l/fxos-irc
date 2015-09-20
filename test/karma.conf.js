'use strict';

module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/bower_components/gaia-component/gaia-component.js',
      'app/bower_components/gaia-slider/gaia-slider.js',
      'app/services/**/*.js',
      'app/views/**/*.js',
      'app/app.js',
      'test/unit/*.test.js',
    ],

    frameworks: ['jasmine'],

    browsers: ['firefox_with_web_components'],
    customLaunchers: {
      'firefox_with_web_components': {
        base: 'Firefox',
        prefs: {'dom.webcomponents.enabled': true}
      }
    },

  });
};
