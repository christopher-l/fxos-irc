'use strict';

var root = angular.module('irc.views.root', [
]);

root.controller(
    'RootCtrl', [
      '$scope',
      '$state',
      '$previousState',
      'theme',
      function($scope, $state, $previousState, theme) {

  $scope.$state = $state;
  $scope.back = function() {
    if ($previousState.get()) {
      $previousState.go();
    } else {
      $state.go('main');
    }
  };

  $scope.$on('$stateChangeSuccess', function(event, toState) {
    if (toState.name.match(/^main/)) {
      theme.setThemeClass('main');
    } else {
      theme.setThemeClass('settings');
    }
  });

}]);
