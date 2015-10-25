'use strict';

var title = angular.module('irc.views.title', [
  'irc.settings',
]);


title.controller(
    'TitleCtrl', [
      '$rootScope', '$scope', 'theme',
      function TitleCtrl($rootScope, $scope, theme) {

  $scope.statusbarColor = 'var(--header-background)';
  $rootScope.title = 'IRC';
  $scope.theme = theme;
  theme.titleScope = $scope;
}]);
