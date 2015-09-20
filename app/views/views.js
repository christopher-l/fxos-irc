'use strict';

var views = angular.module('irc.views', [
  'ui.router',
  'irc.views.gaia',
  'irc.views.main',
  'irc.views.settings',
  'irc.views.network-config',
]);


views.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/show/foo/bar');

  $stateProvider
    .state('main', {
      url: '/',
      abstract: true,
      views: {
        '@': {
          templateUrl: 'views/main/main.html',
          controller: 'MainCtrl',
        },
        'menu@main': {
          templateUrl: 'views/menu/menu.html',
          controller: 'MenuCtrl',
        }
      },
      params: {
        drawer: {}
      }
    })
    .state('main.conversation', {
      url: 'show/:network/:channel',
      templateUrl: 'views/conversation/conversation.html',
      controller: 'ConversationCtrl'
    })
    .state('settings', {
      url: '/settings',
      templateUrl: 'views/settings/settings.html',
      controller: 'SettingsCtrl'
    })
    .state('network-config', {
      url: '/config/network/:index',
      templateUrl: 'views/network-config/network-config.html',
      controller: 'NetConfCtrl'
    });
}]);


views.run(['$rootScope', '$state', function($rootScope, $state) {
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
