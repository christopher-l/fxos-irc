'use strict';

beforeAll(function() {

  var WIDTH = 360;
  var HEIGHT = 640;
  browser.driver.manage().window().setSize(WIDTH, HEIGHT);

  this.helpers = {
    setDefaultNetworks: function() {
      browser.get('');
      browser.executeScript(function() {
        /* global localStorage */
        /* jshint maxlen: false */
        localStorage.networks = '[{"config":{"name":"Foo","autoConnect":true,"port":6667,"host":"foo.com","nick":"foouser"},"lastState":{"status":"disconnected","unreadCount":0,"focused":false,"collapsed":false},"channels":[{"config":{"name":"channel1"},"lastState":{"joined":true,"unreadCount":0,"focused":false}},{"config":{"name":"channel2"},"lastState":{"unreadCount":23,"joined":true,"focused":false}}]},{"config":{"name":"Bar","host":"bar.com","tls":true,"nick":"baruser","port":6697},"lastState":{"status":"disconnected","unreadCount":0,"focused":false,"collapsed":false},"channels":[{"config":{"name":"channel3","autoJoin":true},"lastState":{"unreadCount":0,"focused":false}},{"config":{"name":"channel4"},"lastState":{"unreadCount":0,"focused":false}}]}]';
      });
    }
  };

  /* from https://stackoverflow.com/a/25519113 */
  var ElementFinder = $('').constructor;
  ElementFinder.prototype.foo = function() {
    return this.getWebElement().then(function(el) {
      return 'foo';
    }, function(err) {
      throw err;
    });
  };
  ElementFinder.prototype.setInputText = function(text) {
    return this.getWebElement().then(function(el) {
      return browser.executeScript(function(params) {
        /* global CustomEvent */
        params.el.value = params.text;
        // var args = [];
        params.el.els.input.dispatchEvent(new CustomEvent('input'));
        // for (var i in params.el.els.input) {
        //   args.push(i);
        // }
        // return args;
      }, {el: el, text: text});
    }, function(err) {
      throw err;
    });
  };

});

describe('foo', function() {

  var body = element(by.css('gaia-header'));

  it('bar', function() {
    browser.get('');
    expect(body.bar()).toBe('foo');
  });

});
