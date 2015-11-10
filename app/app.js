'use strict';

var irc = angular.module('irc', [
  'ngAnimate',
  'ngSanitize',
  'irc.views',
  'irc.toast',
  'irc.alert',
]);

irc.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);
