'use strict';

var irc = angular.module('irc');

irc.controller('MainCtrl', ['$scope', function($scope) {
  $scope.theme = 'theme-communications';
  $scope.drawerOpen = false;
}]);

irc.controller('ConversationCtrl', ['$scope', function($scope) {
}]);
