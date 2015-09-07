'use strict';

var ui = angular.module('irc.ui');

ui.controller('TitleCtrl', ['$rootScope', function($rootScope) {
  $rootScope.statusbarColor = 'var(--header-background)';
  $rootScope.title = 'IRC';
}]);

ui.controller('MainCtrl', ['$rootScope', '$scope',
    function($rootScope, $scope) {
  $rootScope.theme = 'theme-communications';
  $scope.type = 'main';
  $scope.drawerOpen = false;

  $scope.networks = [
    {
      name: 'Foo',
      unreadCount: 0,
      status: 'connection-lost',
      channels: [
        {name: 'channel1', unreadCount: 32, focused: true, joined: true},
        {name: 'channel2', unreadCount: 0, joined: true}
      ]
    },
    {
      name: 'Bar',
      unreadCount: 32,
      status: 'connecting',
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

ui.controller('ConversationCtrl', ['$scope', function($scope) {
}]);

ui.controller('SettingsCtrl', ['$rootScope', '$scope', 'storage',
    function($rootScope, $scope, storage) {
  $rootScope.theme = 'theme-settings';
  $scope.type = 'settings';

  storage.default('settings', {
    darkTheme: false,
    fontSize: 12
  });

  $scope.settings = storage.items.settings;

  // $scope.$watch('settings', function() {
  //   storage.save('settings');
  // }, true);
}]);
