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
      {
        pattern: '**/*.css',
        included: false
      },
      {
        pattern: 'bower_components/gaia-icons/fonts/gaia-icons.ttf',
        included: false
      }
    ],

    browsers: ['firefox_with_web_components'],
    customLaunchers: {
      firefox_with_web_components: {
        base: 'Firefox',
        prefs: {'dom.webcomponents.enabled': true}
      }
    },

    proxies: {
      '/bower_components/': 'http://localhost:9876/base/bower_components/',
      '/components/': 'http://localhost:9876/base/components/',
    }
  });
};
