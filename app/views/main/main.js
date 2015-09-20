'use strict';

var main = angular.module('irc.views.main', [
  'ui.router',
  'irc.settings',
  'irc.networks',
  'irc.views.conversation',
  'irc.views.menu',
]);


main.controller('TitleCtrl', ['$scope', 'theme', function($scope, theme) {
  $scope.statusbarColor = 'var(--header-background)';
  $scope.title = 'IRC';
  $scope.theme = theme;
  theme.titleScope = $scope;
}]);


main.controller('MainCtrl', [
    '$scope', '$stateParams', 'networks', 'theme',
    function($scope, $stateParams, networks, theme) {

  $scope.type = 'main';
  theme.setThemeClass('main');

  $scope.drawer = $stateParams.drawer;

  $scope.networks = networks;

  $scope.focus = function(obj) {
    obj.focus();
    if (obj.collapsed) { obj.collapsed = false; }
  };

  $scope.onDelete = function(network) {
    network.dialog.close();
    $scope.confirmDialog.toBeDeleted = network;
    $scope.confirmDialog.open();
    $scope.confirmDialog.onConfirm = function() {
      network.delete();
    };
  };

}]);


// Whenever "theme-group" changes, remove and reappend the "theme-group" and
// "theme-color" meta tags to force the statusbar to apply the new colors.
main.directive('ircThemeGroup',[function() {
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
