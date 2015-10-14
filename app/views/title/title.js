'use strict';

var title = angular.module('irc.views.title', [
  'irc.settings',
]);


title.controller('TitleCtrl',
    ['$scope', 'theme',
    function TitleCtrl($scope, theme) {

  $scope.statusbarColor = 'var(--header-background)';
  $scope.title = 'IRC';
  $scope.theme = theme;
  theme.titleScope = $scope;

  $scope.current = {
    network: null,
    focus: null,
  };

  $scope.focus = function(obj) {
    if ($scope.current.focus) {
      $scope.current.focus.focused = false;
    }
    obj.focused = true;
    $scope.current.focus = obj;
    $scope.current.network =
        obj.constructor.name === 'Network' ?
        obj :
        obj.network;
    if (obj.collapsed) { obj.collapsed = false; }
  };
}]);
