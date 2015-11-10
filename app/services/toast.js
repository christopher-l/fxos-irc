'use strict';

var toast = angular.module('irc.toast', []);

toast.factory('toast', ['$rootScope', function($rootScope) {

  function open(text) {
    $rootScope.$emit('toast', text);
  }

  return open;

}]);

toast.directive('ircToast', ['$rootScope', function($rootScope) {

  function link(scope, element, attrs) {
    var toast = element.find('gaia-toast')[0];
    scope.timeout = 3000;
    $rootScope.$on('toast', function(evt, text) {
      scope.text = text;
      toast.show();
    });
  }

  return {
    restrict: 'E',
    scope: {},
    template: '<gaia-toast timeout="{{timeout}}">{{text}}</gaia-toast>',
    link: link
  };

}]);
