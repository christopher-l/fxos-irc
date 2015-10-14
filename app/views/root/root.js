'use strict';

var root = angular.module('irc.views.root', [
]);

root.directive('ircRootView',[function() {
  return {
    restrict: 'A',
    controller: 'RootCtrl',
    template: `
      <irc-main-view></irc-main-view>

      <irc-config-view
          ng-if="configOpen"
          class="{{theme.settings}}"
          >
      </irc-config-view>
    `,
  };
}]);

root.controller('RootCtrl', [function() {}]);
