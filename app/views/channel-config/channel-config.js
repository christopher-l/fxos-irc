'use strict';

var channelConfig = angular.module('irc.views.channel-config', [
  'irc.views.config',
]);


channelConfig.controller(
    'ChanConfCtrl', [
      '$scope',
      '$timeout',
      '$stateParams',
      'networks',
      function channelConfigCtrl(
          $scope,
          $timeout,
          $stateParams,
          networks) {

  var network = networks.find(function(network) {
    return network.name === $stateParams.network;
  }) || networks[0];
  var channel = network.channels.find(function(channel) {
    return channel.name === $stateParams.channel;
  }) || networks.newChannel();

  $scope.networks = networks;
  $scope.channel = channel.getConfig();

  Object.defineProperty($scope, 'networkIndex', {
    get: function() {
      return network.getIndex().toString();
    },
    set: function(value) {
      network = networks[value];
    }
  });

  $scope.isNew = channel.isNew;

  $scope.onSave = function() {
    $scope.channel.network = network;
    channel.applyConfig($scope.channel);
    $scope.back();
  };

  $scope.onClose = function() {
    $scope.back();
  };

}]);
