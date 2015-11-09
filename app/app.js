'use strict';

var irc = angular.module('irc', [
  'ngAnimate',
  'irc.views',
  'irc.toast',
]);

irc.config(['$compileProvider', function($compileProvider) {
  $compileProvider.debugInfoEnabled(false);
}]);
