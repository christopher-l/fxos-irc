'use strict';

var settings = angular.module('irc.views.settings', [
  'irc.settings',
  'irc.config'
]);


settings.directive('ircSettingsView', [function() {
  return {
    restrict: 'E',
    templateUrl: 'views/settings/settings.html',
    controller: 'SettingsCtrl',
  };
}]);


settings.controller('SettingsCtrl', [
    '$scope', 'settings', 'settingsHandler',
    function($scope, settings, settingsHandler) {

  $scope.settings = settings.data;

  $scope.close = function() {
    settingsHandler.close();
  };

  $scope.$watch('settings', settings.apply, true);
}]);
