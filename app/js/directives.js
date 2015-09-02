'use strict';

var irc = angular.module('irc');

irc.directive('ircAction', function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      element.bind('action', function() {
        scope.$apply(attrs.ircAction);
      });
    }
  };
});

irc.directive('ircOpen', function() {
  return {
    restrict: 'A',
    priority: 100,
    link: function(scope, element, attrs) {
      scope.$watch(attrs.ircOpen, function(value) {
        if (value) {
          element[0].setAttribute('open', '');
        } else {
          element[0].removeAttribute('open');
        }
      });
      // scope.$watch(function() {
      //   return element.attr('open');
      // }, function(value) {
      //   attrs.$set('ircOpen', value);
      // });
    }
  };
});
