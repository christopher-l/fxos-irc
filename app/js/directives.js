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
      scope.$watch(function() {
        return element[0].hasAttribute('open');
      }, function(value) {
        scope[attrs.ircOpen] = value;
      });
      new MutationObserver(function(mutations) {
        mutations.forEach(function(mutation) {
          if (mutation.type === 'attributes' &&
              mutation.attributeName === 'open') {
            scope.$digest();
          }
        });
      }).observe(element[0], {attributes: true});
    }
  };
});

irc.directive('ircClientHeight', function($log) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      scope.$watch(function() {
        return element.prop('clientHeight');
      }, function(value) {
        scope[attrs.ircClientHeight] = value;
        $log.log(value);
      });
    }
  };
});
