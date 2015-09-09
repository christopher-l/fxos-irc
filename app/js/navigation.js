'use strict';

var navigation = angular.module('irc.navigation');

navigation.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/show/foo/bar");

  $stateProvider
    .state('main', {
      url: "/",
      abstract: true,
      templateUrl: "partials/main.html",
      controller: 'MainCtrl',
      params: {
        drawer: {}
      }
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
    })
    .state('network-config', {
      url: "/config/network/:index",
      templateUrl: "partials/network-config.html",
      controller: 'NetConfCtrl'
    });
}]);

navigation.run(['$rootScope', '$state', function($rootScope, $state) {
  $rootScope.$on('$stateChangeSuccess',
      function(event, toState, toParams, fromState, fromParams) {
    $rootScope.prevState = fromState;
    $rootScope.prevParams = fromParams;
  });
  $rootScope.back = function() {
    if (!$rootScope.prevState.abstract) {
      $state.go($rootScope.prevState, $rootScope.prevParams);
    } else {
      $state.go('main.conversation');
    }
  };
}]);
