'use strict';

var irc = angular.module('irc');

irc.controller('MainCtrl', ['$scope', function($scope) {
  $scope.theme = 'theme-communications';
  $scope.drawerOpen = false;

  $scope.networks = [
    {
      name: 'Foo',
      unreadCount: 0,
      channels: [
        {name: 'channel1', unreadCount: 32},
        {name: 'channel2', unreadCount: 0}
      ]
    },
    {
      name: 'Bar',
      unreadCount: 32,
      channels: [
        {name: 'channel3', unreadCount: 0},
        {name: 'channel4', unreadCount: 32}
      ]
    }
  ];
}]);

irc.controller('ConversationCtrl', ['$scope', function($scope) {
}]);
