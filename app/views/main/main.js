'use strict';

var main = angular.module('irc.views.main', [
  'irc.settings',
  'irc.views.conversation',
  'irc.views.menu',
  'irc.views.main.directives',
]);


main.directive('ircMainView', [function() {
  return {
    restrict: 'E',
    controller: 'MainCtrl',
    template: `
      <gaia-header action="menu" irc-action="drawer.open = !drawer.open">
        <h1>{{title}}</h1>
        <button>
          <div id="user-count" style="opacity: {{drawer.open ? 0 : 1}}">
            42
          </div>
        </button>
      </gaia-header>

      <irc-menu-view></irc-menu-view>
      <irc-conversation-view></irc-conversation-view>
    `,
  };
}]);


main.controller('MainCtrl', [
    '$scope',
    function MainCtrl($scope) {

}]);
