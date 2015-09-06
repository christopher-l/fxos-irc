'use strict';

var irc = angular.module('irc', [
  'ui.router',
  'ngAnimate',
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
      url: "show/:network/:channel",
      templateUrl: "partials/conversation.html",
      controller: 'ConversationCtrl'
    })
    .state('settings', {
      url: "/settings",
      templateUrl: "partials/settings.html",
      controller: 'SettingsCtrl'
    });
}]);

irc.run(['$rootScope', '$state', function($rootScope, $state) {
  $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams) {
    $rootScope.prevState = fromState;
    $rootScope.prevParams = fromParams;
  });
  $rootScope.back = function() {
    if (!$rootScope.prevState.abstract) {
      $state.go($rootScope.prevState, $rootScope.prevParams);
    } else {
      $state.go('main');
    }
  };
}]);
