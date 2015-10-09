'use strict';

var menu = angular.module('irc.views.menu', [
  'ui.router',
  'irc.networks',
  'irc.views.menu.directives',
]);


menu.controller('MenuCtrl', [
    '$scope', '$stateParams', 'networks',
    function MenuCtrl($scope, $stateParams, networks) {

  $scope.drawer = $stateParams.drawer;
  $scope.networks = networks;

  $scope.onDelete = function(network) {
    network.dialog.close();
    $scope.confirmDialog.toBeDeleted = network;
    $scope.confirmDialog.open();
    $scope.confirmDialog.onConfirm = function() {
      network.delete();
    };
  };

  $scope.onRemove = function(channel) {
    $scope.channelDialog.close();
    channel.delete();
    // One additional digest cycle, so it will notice the height
    setTimeout(() => $scope.$digest());
  };

  $scope.onChanContext = function(channel) {
    $scope.channelDialog.channel = channel;
    $scope.channelDialog.open();
  };

}]);
