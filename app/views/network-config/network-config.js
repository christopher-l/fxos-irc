'use strict';

var networkConfig = angular.module('irc.views.network-config', [
  'ui.router',
  'irc.views.config',
]);


networkConfig.controller('NetConfCtrl', [
    '$scope', '$rootScope', '$stateParams', 'networks', 'theme',
    function($scope, $rootScope, $stateParams, networks, theme) {

  $scope.type = 'settings';
  theme.setThemeClass('settings');

  var network = $stateParams.index ?
      networks[$stateParams.index] :
      networks.new();
  $scope.network = network.getConfig();

  $scope.isNew = network.new;

  $scope.onSave = function() {
    save();
    $rootScope.back();
  };

  $scope.onClose = function() {
    var changed = network.new ?
        !network.compareConfig($scope.network) :
        !network.compareConfig(finalConfig($scope.network));
    if (changed) {
      $scope.confirmDialog.onConfirm = $rootScope.back;
      $scope.confirmDialog.open();
    } else {
      $rootScope.back();
    }
  };

  function save() {
    var config = finalConfig($scope.network);
    network.applyConfig(config);
  }

  function finalConfig(config) {
    var cfg = angular.copy(config);
    if (!cfg.port) {
      cfg.port = cfg.tls ? 6697 : 6667;
    }
    return cfg;
  }

}]);
