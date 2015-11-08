'use strict';

var ircLib = angular.module('irc.lib', [
]);

ircLib.factory('irc', ['$window', function($window) {
  return $window.lib.irc;
}]);
