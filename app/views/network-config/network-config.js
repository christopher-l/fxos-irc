'use strict';

var networkConfig = angular.module('irc.views.network-config', [
  'ui.router',
  'irc.config',
  'irc.views.config',
]);


networkConfig.controller(
    'NetConfCtrl', [
      '$scope',
      '$rootScope',
      '$stateParams',
      'networks',
      'networkConfig',
      'theme',
      function NetConfCtrl(
          $scope,
          $rootScope,
          $stateParams,
          networks,
          networkConfig,
          theme) {

  $scope.type = 'settings';
  theme.setThemeClass('settings');

  var network = networkConfig.network || networks.newNetwork();
  $scope.network = network.getConfig();

  $scope.isNew = network.isNew;

  $scope.onSave = function() {
    save();
    $rootScope.back();
  };

  $scope.onClose = function() {
    var changed = network.isNew ?
        !network.compareConfig($scope.network) :
        !network.compareConfig(finalConfig($scope.network));
    if (changed) {
      $scope.confirmDialog.onConfirm = close;
      $scope.confirmDialog.open();
    } else {
      close();
    }
  };

  function close() {
    networkConfig.close();
  }

  function save() {
    var conf = finalConfig($scope.network);
    network.applyConfig(conf);
    networkConfig.resolve();
  }

  function finalConfig(config) {
    var cfg = angular.copy(config);
    if (!cfg.port) {
      cfg.port = cfg.tls ? 6697 : 6667;
    }
    return cfg;
  }

}]);
