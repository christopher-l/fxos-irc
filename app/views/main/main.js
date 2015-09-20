'use strict';

var main = angular.module('irc.views.main', [
  'ui.router',
  'irc.settings',
  'irc.networks',
  'irc.views.conversation',
  'irc.views.menu',
  'irc.views.main.directives',
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
