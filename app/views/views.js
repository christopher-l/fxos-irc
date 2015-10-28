'use strict';

var views = angular.module('irc.views', [
  'ui.router',
  'ct.ui.router.extras',
  'irc.views.gaia',
  'irc.views.title',
  'irc.views.root',
  'irc.views.main',
  'irc.views.settings',
  'irc.views.network-config',
  'irc.views.channel-config',
]);

views.config(['$stateProvider', '$urlRouterProvider',
    function($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise('/');

  $stateProvider
      .state('main', {
        url: '/',
        // abstract: true,
        sticky: true,
        deepStateRedirect: {
          default: 'main.conversation'
        },
        views: {
          'main@': {
            templateUrl: 'views/main/main.html',
            controller: 'MainCtrl',
            controllerAs: 'MC',
          },
          'menu@main': {
            templateUrl: 'views/menu/menu.html',
            controller: 'MenuCtrl',
            controllerAs: 'MenuCtrl',
          },
        },
      })
      .state('main.conversation', {
        url: ':network/:channel',
        templateUrl: 'views/conversation/conversation.html',
        controller: 'ConversationCtrl',
        controllerAs: 'CC'
      })
      .state('settings', {
        url: '/settings',
        templateUrl: 'views/settings/settings.html',
        controller: 'SettingsCtrl'
      })
      .state('network-config', {
        url: '/config/network/:network',
        templateUrl: 'views/network-config/network-config.html',
        controller: 'NetConfCtrl',
      })
      .state('channel-config', {
        url: '/config/channel/:network/:channel',
        templateUrl: 'views/channel-config/channel-config.html',
        controller: 'ChanConfCtrl',
      });
}]);
