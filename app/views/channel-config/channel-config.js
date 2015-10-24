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
  $scope.network = network.name;

  Object.defineProperty($scope, 'networkIndex', {
    get: function() {
      return network.getIndex().toString();
    },
    set: function(value) {
      network = networks[value];
      $scope.network = network.name;
    }
  });

  Object.defineProperty($scope, 'channelName', {
    get: function() {
      return '#' + ($scope.channel.name || '');
    },
    set: function(value) {
      if (!value) {
        value = '';
      } else if (value.match(/^#/)) {
        value = value.slice(1);
      }
      $scope.channel.name = value;
    }
  });

  $scope.isNew = channel.isNew;

  $scope.onSave = function() {
    if (nameExists()) {
      $scope.alertDialog.open();
      return;
    }
    channel.applyConfig($scope.channel, network);
    $scope.back();
  };

  $scope.onClose = function() {
    var changed = !channel.compareConfig($scope.channel);
    if (changed) {
      $scope.confirmDialog.open();
    } else {
      $scope.back();
    }
  };

  function nameExists() {
    return network.channels.some(function(chan) {
      return chan !== channel && chan.name === $scope.channel.name;
    });
  }

}]);
