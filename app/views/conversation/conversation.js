'use strict';

var conversation = angular.module('irc.views.conversation', [
  'irc.views.conversation.completion',
]);


conversation.controller('ConversationCtrl', ['$scope', function($scope) {
  $scope.users = ['Fooooo', 'bar', 'baz'];
}]);
