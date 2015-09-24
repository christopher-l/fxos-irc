'use strict';

beforeAll(function() {
  this.helpers = {
    setDefaultNetworks: function() {
      browser.get('');
      browser.executeScript(function() {
        /* global localStorage */
        localStorage.networks = '[{"config":{"name":"Foo","autoConnect":true,"port":6667,"host":"foo.com","nick":"foouser"},"lastState":{"status":"disconnected","unreadCount":0,"focused":false,"collapsed":false},"channels":[{"config":{"name":"channel1"},"lastState":{"joined":true,"unreadCount":0,"focused":false}},{"config":{"name":"channel2"},"lastState":{"unreadCount":23,"joined":true,"focused":false}}]},{"config":{"name":"Bar","host":"bar.com","tls":true,"nick":"baruser","port":6697},"lastState":{"status":"disconnected","unreadCount":0,"focused":false,"collapsed":false},"channels":[{"config":{"name":"channel3","autoJoin":true},"lastState":{"unreadCount":0,"focused":false}},{"config":{"name":"channel4"},"lastState":{"unreadCount":0,"focused":false}}]}]';
      });
    }
  };
});
