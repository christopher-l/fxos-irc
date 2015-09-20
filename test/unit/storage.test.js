'use strict';

describe('storage', function() {

  var Storage;
  var mock;

  beforeEach(module('irc.storage'));

  beforeEach(function() {
    mock = {
      localStorage: {}
    };
    module(function($provide) {
      $provide.value('$window', mock);
    });
    inject(function($injector) {
      Storage = $injector.get('Storage');
    });
  });

  it('should restore nothing', function() {
    var storage = new Storage('foo', {});
    expect(storage.data).toEqual({});
  });

  it('should set the default value', function() {
    var storage = new Storage('foo', 'bar');
    expect(storage.data).toEqual('bar');
  });

  it('should take a string', function() {
    var storage = new Storage('foo', {});
    storage.data = 'bar';
    expect(storage.data).toEqual('bar');
    storage.save();
    expect(storage.data).toEqual('bar');
  });

  it('should keep its data when calling save()', function() {
    var storage = new Storage('foo', {});
    storage.data = 'bar';
    storage.save();
    expect(storage.data).toEqual('bar');
  });

  it('should save a string to localStorage', function() {
    var storage = new Storage('foo', {});
    storage.data = 'bar';
    storage.save();
    expect(mock.localStorage.foo).toEqual('"bar"');
  });

  it('should load a string from localStorage', function() {
    mock.localStorage.foo = '"bar"';
    var storage = new Storage('foo', {});
    expect(storage.data).toEqual('bar');
  });

  it('should take objects', function() {
    var storage = new Storage('foo', {});
    var obj = {foo: 'foo!', bar: 'bar!'};
    storage.data = obj;
    expect(storage.data).toEqual(obj);
    storage.data.baz = 'baz!';
    expect(storage.data.baz).toEqual('baz!');
  });

  it('should save objects to localStorage', function() {
    var storage = new Storage('foo', {});
    var obj = {foo: 'foo!', bar: 'bar!'};
    storage.data = obj;
    storage.save();
    expect(mock.localStorage.foo).toEqual(angular.toJson(obj));
    storage.data.baz = 'baz!';
    storage.save();
    expect(mock.localStorage.foo).toEqual(angular.toJson(obj));
  });

  it('should load objects from localStorage', function() {
    mock.localStorage.foo = '{"foo":"foo!","bar":"bar!"}';
    var storage = new Storage('foo', {});
    expect(storage.data).toEqual({foo: 'foo!', bar: 'bar!'});
  });

});
