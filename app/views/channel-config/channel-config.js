'use strict';

var channelConfig = angular.module('irc.views.channel-config', [
  'ui.router',
  'irc.views.config',
]);


channelConfig.controller(
    'ChanConfCtrl', [
      '$scope',
      '$rootScope',
      '$stateParams',
      '$timeout',
      'networks',
      'channelConfig',
      'theme',
      function channelConfigCtrl(
          $scope,
          $rootScope,
          $stateParams,
          $timeout,
          networks,
          channelConfig,
          theme) {

  $scope.type = 'settings';
  theme.setThemeClass('settings');

  $scope.networks = networks;

  $scope.channel = channelConfig.config;

  Object.defineProperty($scope, 'networkIndex', {
    get: function() {
      return $scope.channel.network.getIndex().toString();
    },
    set: function(value) {
      $scope.channel.network = networks[value];
    }
  });

  $scope.isNew = channelConfig.channel.isNew;

  $scope.onSave = function() {
    channelConfig.save();
  };

  $scope.onClose = function() {
    channelConfig.close();
  };

}]);
