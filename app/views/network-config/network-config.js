'use strict';

var networkConfig = angular.module('irc.views.network-config', [
  'irc.config',
  'irc.views.config',
]);


networkConfig.directive('ircNetworkConfigView',[function() {
  return {
    restrict: 'E',
    templateUrl: 'views/network-config/network-config.html',
    controller: 'NetConfCtrl',
  };
}]);


networkConfig.controller(
    'NetConfCtrl', [
      '$scope',
      '$rootScope',
      'networks',
      'networkConfig',
      function NetConfCtrl(
          $scope,
          $rootScope,
          networks,
          networkConfig) {

  var network = networkConfig.network;
  $scope.network = networkConfig.config;

  $scope.isNew = network.isNew;

  $scope.onSave = function() {
    save();
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
    networkConfig.config = finalConfig($scope.network);
    networkConfig.save();
  }

  function finalConfig(config) {
    var cfg = angular.copy(config);
    if (!cfg.port) {
      cfg.port = cfg.tls ? 6697 : 6667;
    }
    return cfg;
  }

}]);
