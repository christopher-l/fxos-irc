'use strict';

var irc = angular.module('irc');

irc.controller('MainCtrl', ['$scope', function($scope) {
  $scope.theme = 'theme-communications';
  $scope.drawerOpen = false;

  $scope.networks = [
    {
      name: 'Foo',
      unreadCount: 0,
      status: 'connected',
      channels: [
        {name: 'channel1', unreadCount: 32, focused: true, joined: true},
        {name: 'channel2', unreadCount: 0, joined: true}
      ]
    },
    {
      name: 'Bar',
      unreadCount: 32,
      status: 'disconnected',
      channels: [
        {name: 'channel3', unreadCount: 0, autoJoin: true},
        {name: 'channel4', unreadCount: 32}
      ]
    }
  ];

  $scope.focus = function(obj) {
    if ($scope.current) {
      $scope.current.focused = false;
    }
    $scope.current = obj;
    obj.focused = true;
  };
}]);

irc.controller('ConversationCtrl', ['$scope', function($scope) {
}]);
