'use strict';

var config = angular.module('irc.config', [
  'ui.router',
]);

config.factory(
    'GenericConfig', [
      '$rootScope',
      '$q',
      '$state',
      function GenericConfigFactory(
          $rootScope,
          $q,
          $state) {

  function Config() {}

  Config.prototype = {
    open: function() {
      var self = this;
      var deferred = $q(function(resolve, reject) {
        self.resolve = resolve;
        self.reject = reject;
      });
      return deferred;
    },
    close: function() {
      $rootScope.back();
      this.reject();
    },
    save: function() {
      $rootScope.back();
      this.resolve();
    }
  };

  return Config;
}]);


config.factory(
    'networkConfig', [
      '$state',
      'GenericConfig',
      function networkConfigFactory(
          $state,
          GenericConfig) {

  function NetworkConfig(network) {}

  NetworkConfig.prototype = Object.create(GenericConfig.prototype);
  NetworkConfig.prototype.constructor = NetworkConfig;

  NetworkConfig.prototype.open = function(network) {
    this.network = network;
    $state.go('network-config');
    return GenericConfig.prototype.open();
  };

  return new NetworkConfig();
}]);


config.factory(
    'channelConfig', [
      '$state',
      'networks',
      'GenericConfig',
      function channelConfigFactory(
          $state,
          networks,
          GenericConfig) {

  function ChannelConfig(channel) {}

  ChannelConfig.prototype = Object.create(GenericConfig.prototype);
  ChannelConfig.prototype.constructor = ChannelConfig;

  ChannelConfig.prototype.open = function(channel, network) {
    this.channel = channel || networks.newChannel();
    this.config = this.channel.getConfig();
    if (this.channel.isNew) {
      this.config.network = network;
    }
    $state.go('channel-config');
    return GenericConfig.prototype.open();
  };

  return new ChannelConfig();
}]);
