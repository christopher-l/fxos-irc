'use strict';

var irc = angular.module('irc', [
  'ui.router',
]);

irc.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise("/");

  $stateProvider
    .state('main', {
      url: "/",
      templateUrl: "partials/main.html",
      controller: 'MainCtrl'
    })
    .state('main.conversation', {
      url: "/:network/:channel",
      templateUrl: "partials/conversation.html",
      controller: 'ConversationCtrl'
    });
}]);
