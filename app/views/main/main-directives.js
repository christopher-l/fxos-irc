'use strict';

var mainDirectives = angular.module('irc.views.main.directives', []);


// Whenever "theme-group" changes, remove and reappend the "theme-group" and
// "theme-color" meta tags to force the statusbar to apply the new colors.
mainDirectives.directive('ircThemeGroup', [function() {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      attrs.$observe('content', function() {
        var parent = element.parent();
        if (!parent[0]) { return; }
        var themeColor = angular.element(
            parent[0].querySelector('meta[name=theme-color]'));
        element.remove();
        themeColor.remove();
        parent.append(element);
        parent.append(themeColor);
      });
    }
  };
}]);
