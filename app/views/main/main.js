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
}]);


main.controller('MainCtrl', [
    '$scope', '$stateParams', 'theme',
    function MainCtrl($scope, $stateParams, theme) {

  $scope.type = 'main';
  theme.setThemeClass('main');

  $scope.drawer = $stateParams.drawer;

}]);