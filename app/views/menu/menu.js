'use strict';

var menu = angular.module('irc.views.menu', [
  'irc.networks',
  'irc.views.menu.directives',
]);


menu.controller(
    'MenuCtrl', [
      '$scope',
      '$timeout',
      '$state',
      'networks',
      function MenuCtrl(
          $scope,
          $timeout,
          $state,
          networks) {

  $scope.networks = networks;

  var activeRoom = null;

  function focusGeneric(room) {
    if (activeRoom) {
      activeRoom.focused = false;
    }
    activeRoom = room;
    room.focused = true;
  }

  function focusNetwork(network) {
    focusGeneric(network);
    $scope.activeNetwork = network;
    network.collapsed = false;
    $state.go('main.conversation', {
      network: network.name,
      channel: null
    });
  }

  function focusChannel(channel) {
    focusGeneric(channel);
    $scope.activeNetwork = channel.network.name;
    $state.go('main.conversation', {
      network: channel.network.name,
      channel: channel.name
    });
  }


  // Networks
  $scope.onNetClick = function(network) {
    if (network.focused && network.status === 'connected') {
      $scope.drawer.open = false;
    }
    if (!network.focused) {
      focusNetwork(network);
    }
    if (network.status !== 'connected') {
      network.connect();
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


  // Channels
  $scope.onChanClick = function(channel) {
    if (!channel.focused) {
      focusChannel(channel);
    }
    if (channel.network.status === 'connected') {
      channel.joined = true;
      $scope.drawer.open = false;
    } else {
      channel.network.connect().then(function() {
        channel.joined = true;
        $scope.drawer.open = false;
      });
    }
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

}]);
