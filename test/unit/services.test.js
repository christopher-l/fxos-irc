'use strict';

describe('storage', function() {

  var storage;
  var mock;

  beforeEach(module('irc.data'));

  var removeItem = function(item) {
    delete mock.localStorage[item];
  };

  var mockLocalStorage = function(localStorage) {
    localStorage.removeItem = removeItem;
    return localStorage;
  };

  var reload = function() {
    storage.clear();
    storage.loadAll();
  };

  beforeEach(function() {
    mock = {localStorage: mockLocalStorage({})};
    mock.addEventListener = angular.noop;
    module(function($provide) {
      $provide.value('$window', mock);
    });
    inject(function($injector) {
      storage = $injector.get('storage');
    });
  });

  it('should restore nothing', function() {
    expect(storage).toEqual({});
  });

  it('should take a string', function() {
    storage.foo = 'bar';
    expect(storage).toEqual({foo: 'bar'});
  });

  it('should clear on reload if not saved', function() {
    storage.foo = 'bar';
    expect(storage).toEqual({foo: 'bar'});
    reload();
    expect(storage).toEqual({});
  });

  it('should be persistent', function() {
    storage.foo = 'bar';
    storage.saveAll();
    reload();
    expect(storage).toEqual({foo: 'bar'});
  });

  it('should be persistent with multiple strings', function() {
    storage.foo = 'foo!';
    storage.bar = 'bar!';
    storage.baz = 'baz!';
    storage.saveAll();
    reload();
    expect(storage).toEqual({foo: 'foo!', bar: 'bar!', baz: 'baz!'});
  });

  it('should clear localStorage', function() {
    storage.foo = 'bar';
    expect(storage).toEqual({foo: 'bar'});
    storage.saveAll();
    storage.clearLocalStorage();
    expect(mock.localStorage).toEqual(mockLocalStorage({}));
  });

  it('should clear localStorage with multiple strings', function() {
    storage.foo = 'foo!';
    storage.bar = 'bar!';
    storage.baz = 'baz!';
    expect(storage).toEqual({foo: 'foo!', bar: 'bar!', baz: 'baz!'});
    storage.saveAll();
    storage.clearLocalStorage();
    expect(mock.localStorage).toEqual(mockLocalStorage({}));
  });

  it('should work with objects', function() {
    var obj = {foo: 'foo!', bar: 'bar!'};
    storage.networks = obj;
    // storage.saveAll();
    // reload();
    expect(storage.networks).toEqual(obj);
    expect(mock.localStorage.networks).toEqual(angular.toJson(obj));
    storage.networks.baz = 'baz!';
    expect(storage.networks.baz).toEqual('baz!');
    expect(mock.localStorage.networks).toEqual(angular.toJson(obj));
  });

  it('should not clear data that is not prefixed', function() {
    mock.localStorage.foo = 'bar';
    storage.clear();
    expect(mock.localStorage.foo).toEqual('bar');
  });

  it('should save individual items', function() {
    storage.foo = 'foo!';
    storage.bar = 'bar!';
    storage.save('foo');
    reload();
    expect(storage).toEqual({foo: 'foo!'});
  });

});
