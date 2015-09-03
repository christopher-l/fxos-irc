module.exports = function(config){
  config.set({

    basePath : '../',

    files : [
      'app/bower_components/angular/angular.js',
      'app/bower_components/angular-ui-router/release/angular-ui-router.js',
      'app/bower_components/angular-mocks/angular-mocks.js',
      'app/js/*.js',
      'test/unit/*.test.js',
    ],

    frameworks: ['jasmine'],

    browsers: ['firefox_with_web_components'],
    customLaunchers: {
      firefox_with_web_components: {
        base: 'Firefox',
        prefs: {'dom.webcomponents.enabled': true}
      }
    },

  });
};
