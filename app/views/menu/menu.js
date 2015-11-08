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

  var MainCtrl = $scope.MC;

  var activeRoom = null;

  function focus() {
    if (activeRoom) {
      activeRoom.focused = false;
    }
    activeRoom = MainCtrl.room;
    if (MainCtrl.room) {
      MainCtrl.room.focused = true;
    }
    if (MainCtrl.channel) {
      MainCtrl.network.collapsed = false;
      MainCtrl.channel.unreadCount = 0;
    }
  }

  $scope.$on('$stateChangeSuccess', function() {
    focus();
  });

  // Networks
  this.onNetClick = function(network) {
    if (!network.online) {
      network.connect();
      $state.go('main.conversation', {
        network: network.name,
        channel: null
      });
      return;
    }
    if (!network.focused) {
      $state.go('main.conversation', {
        network: network.name,
        channel: null
      });
    }
    $scope.drawer.open = false;
  };

  this.onNetContext = function(network) {
    $scope.networkDialog.network = network;
    $timeout(function() {
      $scope.networkDialog.open();
    });
  };

  this.onNetworkDialogClosed = function() {
    $scope.networkDialog.network = null;
  };

  this.onDelete = function() {
    var network = $scope.networkDialog.network;
    $scope.networkDialog.close();
    $scope.confirmDialog.toBeDeleted = network;
    $scope.confirmDialog.open();
    $scope.confirmDialog.onConfirm = function() {
      network.delete();
    };
  };


  // Channels
  this.onChanClick = function(channel) {
    if (!channel.focused) {
      $state.go('main.conversation', {
        network: channel.network.name,
        channel: channel.name
      });
    }
    if (channel.network.online) {
      channel.join();
      $scope.drawer.open = false;
    } else {
      channel.network.connect().then(function() {
        channel.join();
        $scope.drawer.open = false;
      });
    }
  };

  this.onChanContext = function(channel) {
    $scope.channelDialog.channel = channel;
    $scope.channelDialog.open();
  };

  this.onChannelDialogClosed = function() {
    $scope.channelDialog.channel = null;
  };

  this.onRemove = function(channel) {
    channel.delete();
    // One additional digest cycle, so it will notice the height change
    $timeout();
  };

}]);
