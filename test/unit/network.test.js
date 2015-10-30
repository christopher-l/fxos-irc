'use strict';

describe('Network', function() {

  var network;
  var storageRef;
  var networks;
  var storage;

  beforeEach(module('irc.networks'));

  describe('from storage', function() {

    beforeEach(function() {
      storage = {
        data: [],
        save: () => null
      };
      module(function($provide) {
        $provide.value('Storage', function() {
          return storage;
        });
      });
      var Network;
      inject(function($injector) {
        Network = $injector.get('networks').newNetwork().constructor;
      });
      storageRef = {
        config: {
          name: 'Foo',
          autoConnect: false,
        },
        channels: []
      };
      storage.data = ['foo', storageRef, 'bar'];
      storage.save = jasmine.createSpy('storage.save');
      network = new Network(storageRef);
      networks = ['fooo', network, 'baar'];
      network._volatile = networks;
    });

    it('should have the correct properties', function() {
      expect(Object.keys(network)).toEqual([
        '_storageRef',
        '_config',
        'messages',
        '_storage',
        '_volatile',
        'status',
        'collapsed',
        'channels'
      ]);
    });

    it('should read the config', function() {
      expect(network.name).toBe('Foo');
      expect(network.autoConnect).toBe(false);
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
      expect(Object.keys(storageRef).length).toBe(2);
      expect(storageRef.config).toBe(network._config);
      expect(storageRef.channels).toEqual([]);
    });

    it('should not allow to change the config directly', function() {
      expect(function() {network.name = 'Bar';}).toThrow();
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
      network = networks.newNetwork();
    }));

    it('should have the correct properties', function() {
      expect(Object.keys(network)).toEqual([
        'isNew',
        '_config',
        '_storageRef',
        'messages',
        '_storage',
        '_volatile',
        'status',
        'collapsed',
        'channels'
      ]);
    });

    it('should set up its storage reference', function() {
      expect(Object.keys(network._storageRef).length).toBe(2);
      expect(network._storageRef.config).toBe(network._config);
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
