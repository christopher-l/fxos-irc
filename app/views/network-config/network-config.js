'use strict';

var networkConfig = angular.module('irc.views.network-config', [
  'ui.router',
  'irc.views.config',
]);


networkConfig.controller('NetConfCtrl', [
    '$scope', '$stateParams', 'networks', 'theme',
    function($scope, $stateParams, networks, theme) {

  $scope.type = 'settings';
  theme.setThemeClass('settings');

  var network = $stateParams.index ?
      networks[$stateParams.index] :
      networks.new();
  $scope.network = network.getConfig();

  $scope.isNew = network.new;

  $scope.save = function() {
    if (!$scope.network.port) {
      $scope.network.port = $scope.network.tls ? 6697 : 6667;
    }
    network.applyConfig($scope.network);
  };

}]);
