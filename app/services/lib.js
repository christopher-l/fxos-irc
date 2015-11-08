'use strict';

var lib = angular.module('irc.lib', [
]);

lib.factory('irc', ['$window', function($window) {
  return $window.nodeIrc;
}]);
