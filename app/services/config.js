'use strict';

var config = angular.module('irc.config', [
  'ui.router',
]);

config.factory(
    'GenericConfig', [
      '$rootScope',
      '$q',
      '$state',
      'theme',
      function GenericConfigFactory(
          $rootScope,
          $q,
          $state,
          theme) {

  function Config() {}

  Config.prototype = {
    open: function() {
      $rootScope.configOpen = true;
      theme.setThemeClass('settings');
      var self = this;
      var deferred = $q(function(resolve, reject) {
        self.resolve = resolve;
        self.reject = reject;
      });
      return deferred;
    },
    close: function(success) {
      theme.setThemeClass('main');
      $rootScope.configOpen = false;
      if (success) {
        this.resolve();
      } else {
        this.reject();
      }
    },
  };

  return Config;
}]);


config.factory(
    'networkConfig', [
      '$state',
      'networks',
      'GenericConfig',
      function networkConfigFactory(
          $state,
          networks,
          GenericConfig) {

  function NetworkConfig(network) {}

  NetworkConfig.prototype = Object.create(GenericConfig.prototype);
  NetworkConfig.prototype.constructor = NetworkConfig;

  NetworkConfig.prototype.open = function(network) {
    this.network = network || networks.newNetwork();
    this.config = this.network.getConfig();
    return GenericConfig.prototype.open();
  };

  NetworkConfig.prototype.save = function() {
    this.network.applyConfig(this.config);
    this.close(true);
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

  ChannelConfig.prototype.save = function() {
    this.channel.applyConfig(this.config);
    this.close(true);
  };

  return new ChannelConfig();
}]);
