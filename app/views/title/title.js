'use strict';

var title = angular.module('irc.views.title', [
  'irc.settings',
]);


title.controller(
    'TitleCtrl', [
      '$scope', 'theme',
      function TitleCtrl($scope, theme) {

  $scope.statusbarColor = 'var(--header-background)';
  $scope.title = 'IRC';
  $scope.theme = theme;
  theme.titleScope = $scope;
}]);
