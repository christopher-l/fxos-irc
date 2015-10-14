'use strict';

var menu = angular.module('irc.views.menu', [
  'irc.networks',
  'irc.config',
  'irc.views.menu.directives',
]);


menu.directive('ircMenuView', [function() {
  return {
    restrict: 'E',
    templateUrl: 'views/menu/menu.html',
    controller: 'MenuCtrl',
  };
}]);


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

  // Avoid flickering on application load
  setTimeout(function() {
    $scope.finishedLoading = true;
  });

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

  $scope.networkDialog = {};

  $scope.onNetContext = function(network) {
    $scope.networkDialog.network = network;
    $scope.networkDialog.open();
  };

  $scope.networkDialog.onClose = function() {
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
    networkConfig.open()
        .then(function() {
        }, function() {
        });
  };

  $scope.onEditNetork = function(network) {
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

  $scope.channelDialog = {};

  $scope.onChanContext = function(channel) {
    $scope.channelDialog.channel = channel;
    $scope.channelDialog.open();
  };

  $scope.channelDialog.onClose = function() {
    $scope.channelDialog.channel = null;
  };

  $scope.onRemove = function(channel) {
    $scope.channelDialog.close();
    channel.delete();
    // One additional digest cycle, so it will notice the height
    setTimeout(() => $scope.$digest());
  };

  $scope.onAddChannel = function() {
    channelConfig.open(null, $scope.current.network || networks[0]);
  };

  $scope.onEditChannel = function(channel) {
    channelConfig.open(channel);
  };

}]);
