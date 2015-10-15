'use strict';

var root = angular.module('irc.views.root', [
]);

root.controller(
    'RootCtrl', [
      '$scope',
      '$state',
      '$previousState',
      function($scope, $state, $previousState) {

  $scope.$state = $state;
  $scope.back = function() {
    if ($previousState.get()) {
      $previousState.go();
    } else {
      $state.go('main');
    }
  };

}]);
