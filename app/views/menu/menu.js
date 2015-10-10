'use strict';

var menu = angular.module('irc.views.menu', [
  'ui.router',
  'irc.networks',
  'irc.views.menu.directives',
]);


menu.controller('MenuCtrl', [
    '$scope', '$stateParams', '$timeout', 'networks',
    function MenuCtrl($scope, $stateParams, $timeout, networks) {

  $scope.drawer = $stateParams.drawer;
  $scope.networks = networks;

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

}]);
