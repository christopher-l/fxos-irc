'use strict';

var channelConfig = angular.module('irc.views.channel-config', [
  'ui.router',
  'irc.views.config',
]);


channelConfig.controller(
    'ChanConfCtrl', [
      '$scope', '$rootScope', '$stateParams', '$timeout', 'networks', 'theme',
      function($scope, $rootScope, $stateParams, $timeout, networks, theme) {

  $scope.type = 'settings';
  theme.setThemeClass('settings');

  $scope.networks = networks;

  var channel = $stateParams.channelIndex ?
      networks[$stateParams.networkIndex].channels[$stateParams.channelIndex] :
      networks.newChannel();
  $scope.channel = channel.getConfig();

  $timeout(function() {
    // Give ngRepeat time to populate the list first
    $scope.channel.networkIndex = $stateParams.networkIndex;
  });

  $scope.isNew = channel.isNew;

  $scope.onSave = function() {
    save();
    $rootScope.back();
  };

  $scope.onClose = function() {
    $rootScope.back();
  };

  function save() {
    channel.applyConfig($scope.channel);
  }

}]);
