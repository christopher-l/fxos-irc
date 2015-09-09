'use strict';

angular.module('irc.navigation', [
  'ui.router'
]);

angular.module('irc.ui', [
  'irc.data'
]);

angular.module('irc.data', []);

angular.module('irc.adapters', []);

angular.module('irc', [
  'ngAnimate',
  'irc.navigation',
  'irc.ui',
  'irc.data',
  'irc.adapters'
]);
