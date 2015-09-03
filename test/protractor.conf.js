'use strict';
var q = require('q');
var FirefoxProfile = require('firefox-profile');

/* https://github.com/juliemr/protractor-demo/tree/master/howtos/setFirefoxProfile */
var getFirefoxProfile = function() {
  var deferred = q.defer();
  var firefoxProfile = new FirefoxProfile();
  firefoxProfile.setPreference('dom.webcomponents.enabled', true);
  firefoxProfile.encoded(function(encodedProfile) {
    var multiCapabilities = [{
      browserName: 'firefox',
      firefox_profile : encodedProfile
    }];
    deferred.resolve(multiCapabilities);
  });

  return deferred.promise;
};

exports.config = {
  allScriptsTimeout: 11000,

  specs: [
    'e2e/*.test.js'
  ],

  baseUrl: 'http://localhost:8000/app/',

  framework: 'jasmine2',

  jasmineNodeOpts: {
    defaultTimeoutInterval: 30000
  },

  getMultiCapabilities: getFirefoxProfile
};
