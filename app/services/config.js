'use strict';

var config = angular.module('irc.config', [
  'irc.settings',
]);

config.factory(
    'GenericConfig', [
      '$rootScope',
      '$q',
      'theme',
      function GenericConfigFactory(
          $rootScope,
          $q,
          theme) {

  function Config() {}

  Config.prototype = {
    open: function() {
      theme.setThemeClass('settings');
      $rootScope.configOpen = this.constructor.name;
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
      'networks',
      'GenericConfig',
      function networkConfigFactory(
          networks,
          GenericConfig) {

  function NetworkConfig(network) {}

  NetworkConfig.prototype = Object.create(GenericConfig.prototype);
  NetworkConfig.prototype.constructor = NetworkConfig;

  NetworkConfig.prototype.open = function(network) {
    this.network = network || networks.newNetwork();
    this.config = this.network.getConfig();
    return GenericConfig.prototype.open.call(this);
  };

  NetworkConfig.prototype.save = function() {
    this.network.applyConfig(this.config);
    this.close(true);
  };

  return new NetworkConfig();
}]);


config.factory(
    'channelConfig', [
      'networks',
      'GenericConfig',
      function channelConfigFactory(
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
    return GenericConfig.prototype.open.call(this);
  };

  ChannelConfig.prototype.save = function() {
    this.channel.applyConfig(this.config);
    this.close(true);
  };

  return new ChannelConfig();
}]);


config.factory(
    'settingsHandler', [
      'GenericConfig',
      function channelConfigFactory(
          GenericConfig) {

  function Settings(channel) {}

  Settings.prototype = Object.create(GenericConfig.prototype);
  Settings.prototype.constructor = Settings;

  return new Settings();
}]);
