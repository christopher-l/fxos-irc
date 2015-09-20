'use strict';

var settings = angular.module('irc.views.settings', [
  'irc.settings'
]);


settings.controller('SettingsCtrl', [
    '$scope', 'settings', 'theme',
    function($scope, settings, theme) {

  $scope.type = 'settings';
  theme.setThemeClass('settings');

  $scope.settings = settings.data;

  $scope.$watch('settings', settings.apply, true);
}]);
