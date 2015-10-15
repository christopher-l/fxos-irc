'use strict';

var menu = angular.module('irc.views.menu', [
  'irc.networks',
  'irc.config',
  'irc.views.menu.directives',
]);


menu.controller(
    'MenuCtrl', [
      '$scope',
      '$timeout',
      'networks',
      'networkConfig',
      'channelConfig',
      'settingsHandler',
      function MenuCtrl(
          $scope,
          $timeout,
          networks,
          networkConfig,
          channelConfig,
          settingsHandler) {

  $scope.networks = networks;

  $scope.openSettings = function() {
    settingsHandler.open();
  };

  // Networks
  $scope.onNetClick = function(network) {
    $scope.focus(network);
    if (network.status !== 'connected') {
      network.status = 'connecting';
      $timeout(function() {
        network.status = 'connected';
      }, 500);
    }
  };

  $scope.onNetContext = function(network) {
    $scope.networkDialog.network = network;
    $timeout(function() {
      $scope.networkDialog.open();
    });
  };

  this.onNetworkDialogClosed = function() {
    $scope.networkDialog.network = null;
  };

  $scope.onDelete = function() {
    var network = $scope.networkDialog.network;
    $scope.networkDialog.close();
    $scope.confirmDialog.toBeDeleted = network;
    $scope.confirmDialog.open();
    $scope.confirmDialog.onConfirm = function() {
      network.delete();
    };
  };

  $scope.onAddNetwork = function() {
    $scope.networkDialog.close();
    networkConfig.open()
        .then(function() {
        }, function() {
        });
  };

  $scope.onEditNetork = function(network) {
    $scope.networkDialog.close();
    networkConfig.open(network)
        .then(function() {
        }, function() {
          $scope.confirmDialog.open();
        });
  };

  // Channels
  $scope.onChanClick = function(channel) {
    $scope.focus(channel);
    channel.joined = true;
  };

  $scope.onChanContext = function(channel) {
    $scope.channelDialog.channel = channel;
    $scope.channelDialog.open();
  };

  this.onChannelDialogClosed = function() {
    $scope.channelDialog.channel = null;
  };

  $scope.onRemove = function(channel) {
    $scope.channelDialog.close();
    channel.delete();
    // One additional digest cycle, so it will notice the height
    $timeout();
  };

  $scope.onAddChannel = function() {
    $scope.channelDialog.close();
    channelConfig.open(null, $scope.current.network || networks[0]);
  };

  $scope.onEditChannel = function(channel) {
    $scope.channelDialog.close();
    channelConfig.open(channel);
  };

}]);
