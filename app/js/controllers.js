'use strict';

var irc = angular.module('irc');

irc.controller('MainCtrl', function($scope) {
  $scope.theme = 'theme-communications';
  $scope.drawerOpen = false;
});

irc.controller('ConversationCtrl', function($scope) {
});
