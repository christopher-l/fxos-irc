'use strict';

var settings = angular.module('irc.views.settings', [
  'irc.settings',
]);


settings.directive('ircSettingsView', [function() {
  return {
    restrict: 'E',
    templateUrl: 'views/settings/settings.html',
    controller: 'SettingsCtrl',
  };
}]);


settings.controller('SettingsCtrl', [
    '$scope', 'settings',
    function($scope, settings) {

  $scope.settings = settings.data;

  $scope.$watch('settings', settings.apply, true);
}]);
