'use strict';

var menu = angular.module('irc.views.menu', []);


// Bind to a long touch on mobile and right click on desktop.
// From https://stackoverflow.com/a/15732476
menu.directive('ircContextMenu', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var fn = $parse(attrs.ircContextMenu);
      element.bind('contextmenu', function(event) {
        scope.$apply(function() {
          event.preventDefault();
          fn(scope, {$event: event});
        });
      });
    }
  };
}]);


// Bind the client-height property to a given scope variable.
menu.directive('ircClientHeight', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var model = $parse(attrs.ircClientHeight);
      scope.$watch(function() {
        return element.prop('clientHeight');
      }, function(value) {
        model.assign(scope, value);
      });
    }
  };
}]);
