'use strict';

describe('Network', function() {

  var network;
  var storageRef;
  var networks;
  var storage;

  beforeEach(module('irc.networks'));

  describe('from storage', function() {

    beforeEach(module(function($provide) {
      storageRef = {
        config: {
          name: 'Foo',
          autoConnect: true,
        },
        lastState: {
          unreadCount: 0,
          status: 'connected',
        },
        channels: []
      };
      storage = {
        data: ['foo', storageRef, 'bar'],
        save: jasmine.createSpy('storage.save')
      };
      networks = ['fooo', 'nerwork', 'baar'];
      $provide.value('netData', {storage: storage, networks: networks});
    }));

    beforeEach(inject(function(Network) {
      network = new Network(storageRef);
      networks[1] = network;
    }));

    it('should have the correct properties', function() {
      expect(Object.keys(network)).toEqual([
        '_storageRef',
        '_config',
        '_storage',
        '_volatile',
        '_state',
        'channels'
      ]);
    });

    it('should read the config', function() {
      expect(network.name).toBe('Foo');
      expect(network.autoConnect).toBe(true);
    });

    it('should initialize a new state', function() {
      expect(network.status).toBe('disconnected');
    });

    it('should set up an empty channel list', function() {
      expect(network.channels).toEqual([]);
      expect(network.channels).not.toBe(storageRef.channels);
    });

    it('should link to storageRef', function() {
      expect(network._storageRef).toBe(storageRef);
    });

    it('should set up its storage reference', function() {
      expect(Object.keys(storageRef).length).toBe(3);
      expect(storageRef.config).toBe(network._config);
      expect(storageRef.lastState).toBe(network._state);
      expect(storageRef.channels).toEqual([]);
    });

    it('should not allow to change the config directly', function() {
      expect(function() {network.name = 'Bar';}).toThrow();
    });

    it('should allow to change the state', function() {
      network.status = 'connected';
      expect(network._state.status).toBe('connected');
    });

    it('should save the changed state', function() {
      network.status = 'connected';
      expect(storage.save).toHaveBeenCalled();
    });

    it('should give a copy of the config', function() {
      var config = network.getConfig();
      expect(config).not.toBe(network._config);
      expect(config).toEqual(network._config);
    });

    it('should apply a changed config', function() {
      var config = network.getConfig();
      config.name = 'Bar';
      config.autoConnect = false;
      network.applyConfig(config);
      expect(network.name).toBe('Bar');
      expect(network.autoConnect).toBe(false);
    });

    it('should save when applying a config', function() {
      var config = network.getConfig();
      expect(storage.save).not.toHaveBeenCalled();
      network.applyConfig(config);
      expect(storage.save).toHaveBeenCalled();
    });

    it('should save to storage', function() {
      var config = network.getConfig();
      network.applyConfig(config);
      expect(network._storageRef.config).toBe(network._config);
    });

    it('should delete the network from networks', function() {
      network.delete();
      expect(networks).toEqual(['fooo', 'baar']);
    });

    it('should delete the network from storage', function() {
      network.delete();
      expect(storage.data).toEqual(['foo', 'bar']);
      expect(storage.save).toHaveBeenCalled();
    });

  });

  describe('newly created', function() {

    beforeEach(module(function($provide) {
      networks = ['fooo', 'baar'];
      storage = {
        data: ['foo', 'bar'],
        save: jasmine.createSpy('storage.save')
      };
      $provide.value('netData', {storage: storage, networks: networks});
    }));

    beforeEach(inject(function(Network) {
      network = new Network();
    }));

    it('should have the correct properties', function() {
      expect(Object.keys(network)).toEqual([
        'isNew',
        '_config',
        '_storageRef',
        '_storage',
        '_volatile',
        '_state',
        'channels'
      ]);
    });

    it('should set up its storage reference', function() {
      expect(Object.keys(network._storageRef).length).toBe(3);
      expect(network._storageRef.config).toBe(network._config);
      expect(network._storageRef.lastState).toBe(network._state);
      expect(network._storageRef.channels).toEqual([]);
    });

    it('should be marked new', function() {
      expect(network.isNew).toBe(true);
    });

    it('should initialize its state', function() {
      expect(network.status).toBe('disconnected');
    });

    it('should have an empty channel list', function() {
      expect(network.channels).toEqual([]);
    });

    it('should not yet be in the networks list', function() {
      expect(networks.length).toBe(2);
    });

    it('should be pushed to the networks list when saved', function() {
      network.save();
      expect(networks[2]).toBe(network);
    });

    it('should lose its new property when saved', function() {
      network.save();
      expect(network.isNew).toBeUndefined();
    });

  });

});
