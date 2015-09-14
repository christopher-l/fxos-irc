'use strict';

var ui = angular.module('irc.ui');

ui.controller('TitleCtrl', ['$scope', 'theme', function($scope, theme) {
  $scope.statusbarColor = 'var(--header-background)';
  $scope.title = 'IRC';
  $scope.theme = theme;
  theme.titleScope = $scope;
}]);

ui.controller('MainCtrl', [
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

ui.controller('ConversationCtrl', ['$scope', function($scope) {
}]);

ui.controller('SettingsCtrl', [
    '$scope', 'settings', 'theme',
    function($scope, settings, theme) {

  $scope.type = 'settings';
  theme.setThemeClass('settings');

  $scope.settings = settings.data;

  $scope.$watch('settings', settings.apply, true);
}]);

ui.controller('NetConfCtrl', [
    '$scope', '$stateParams', 'networks', 'theme',
    function($scope, $stateParams, networks, theme) {

  $scope.type = 'settings';
  theme.setThemeClass('settings');

  var network = networks[$stateParams.index];
  $scope.network = network.getConfig();

  $scope.save = function() {
    network.applyConfig($scope.network);
  };

}]);
