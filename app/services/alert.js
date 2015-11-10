'use strict';

var alert = angular.module('irc.alert', []);

alert.factory('alert', ['$rootScope', function($rootScope) {

  function open(text) {
    $rootScope.$emit('alert', text);
  }

  return open;

}]);

alert.directive('ircAlert', ['$rootScope', function($rootScope) {

  function link(scope, element, attrs) {
    var alert = element.find('gaia-dialog-alert')[0];
    $rootScope.$on('alert', function(evt, text) {
      scope.text = text;
      alert.open();
    });
  }

  return {
    restrict: 'E',
    scope: {},
    template: '<gaia-dialog-alert ng-bind-html="text"></gaia-dialog-alert>',
    link: link
  };

}]);
