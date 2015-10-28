'use strict';

var main = angular.module('irc.views.main', [
  'irc.views.conversation',
  'irc.views.menu',
  'irc.views.main.directives',
]);


main.controller(
    'MainCtrl', [
      '$scope',
      'networks',
      function MainCtrl($scope, networks) {

  this.updateCurrentRoom = function updateCurrentRoom(params) {
    this.network = networks.find(function(network) {
      return network.name === params.network;
    });

    if (this.network) {
      this.channel = this.network.channels.find(function(channel) {
        return channel.name === params.channel;
      });
    }

    this.room = this.channel || this.network;

    if (this.channel) {
      $scope.title = '#' + this.channel.name;
    } else if (this.network) {
      $scope.title = this.network.name;
    }
  };

  $scope.users = ['Fooooo', 'bar', 'baz'];

}]);
