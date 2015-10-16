'use strict';

var networkConfig = angular.module('irc.views.network-config', [
  'irc.views.config',
]);


networkConfig.controller(
    'NetConfCtrl', [
      '$scope',
      '$rootScope',
      '$stateParams',
      'networks',
      function NetConfCtrl(
          $scope,
          $rootScope,
          $stateParams,
          networks) {

  var network = networks.find(function(network) {
    return network.name === $stateParams.network;
  }) || networks.newNetwork();
  $scope.network = network.getConfig();
  $scope.isNew = network.isNew;

  $scope.onSave = function() {
    network.applyConfig(finalConfig($scope.network));
    $scope.back();
  };

  $scope.onClose = function() {
    var changed = network.isNew ?
        !network.compareConfig($scope.network) :
        !network.compareConfig(finalConfig($scope.network));
    if (changed) {
      $scope.confirmDialog.open();
    } else {
      $scope.back();
    }
  };

  function finalConfig(config) {
    var cfg = angular.copy(config);
    if (!cfg.port) {
      cfg.port = cfg.tls ? 6697 : 6667;
    }
    return cfg;
  }

}]);
