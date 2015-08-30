// Karma configuration
// Generated on Sun Aug 16 2015 17:44:29 GMT+0200 (CEST)

module.exports = function(config) {
  config.set({
    basePath: '../',
    frameworks: ['jasmine'],

    files: [
      'test/setupHTML.js',
      'js/helpers.js',
      'bower_components/gaia-component/gaia-component.js',
      'bower_components/*/*.js',
      'components/dialog/dialog.js',
      'components/**/*.js',
      'js/config.js',
      'js/*.js',
      'test/*test.js',
    ],

    browsers: ['firefox_with_web_components'],
    customLaunchers: {
      firefox_with_web_components: {
        base: 'Firefox',
        prefs: {'dom.webcomponents.enabled': true}
      }
    },

    urlRoot: '/_karma_/',
    proxies: {
      '/': 'http://localhost:9876/base/',
    }
  });
};
