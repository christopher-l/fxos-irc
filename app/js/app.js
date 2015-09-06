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
    .state('settings', {
      url: "/settings",
      templateUrl: "partials/settings.html",
      controller: 'SettingsCtrl'
    })
    .state('main.conversation', {
      url: ":network/:channel",
      templateUrl: "partials/conversation.html",
      controller: 'ConversationCtrl'
    });
}]);

irc.run(['$rootScope', '$state', function($rootScope, $state) {
  $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams) {
    $rootScope.prevState = fromState;
    $rootScope.prevParams = fromParams;
  });
  $rootScope.back = function() {
    $state.go($rootScope.prevState, $rootScope.prevParams);
  };
}]);
