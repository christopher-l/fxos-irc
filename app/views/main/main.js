'use strict';

var main = angular.module('irc.views.main', [
  'ui.router',
  'irc.settings',
  'irc.views.conversation',
  'irc.views.menu',
  'irc.views.main.directives',
]);


main.controller('TitleCtrl',
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


main.controller('MainCtrl', [
    '$scope', '$stateParams', 'theme',
    function MainCtrl($scope, $stateParams, theme) {

  console.log('MAIN')

  $scope.type = 'main';
  theme.setThemeClass('main');

  $scope.drawer = $stateParams.drawer;

}]);
