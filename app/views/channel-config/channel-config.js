'use strict';

var channelConfig = angular.module('irc.views.channel-config', [
  'irc.views.config',
]);


channelConfig.directive('ircChannelConfigView',[function() {
  return {
    restrict: 'E',
    templateUrl: 'views/channel-config/channel-config.html',
    controller: 'ChanConfCtrl',
  };
}]);


channelConfig.controller(
    'ChanConfCtrl', [
      '$scope',
      '$rootScope',
      '$timeout',
      'networks',
      'channelConfig',
      function channelConfigCtrl(
          $scope,
          $rootScope,
          $timeout,
          networks,
          channelConfig) {

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
