'use strict';
/* global CustomEvent */

beforeAll(function() {

  /**
   * Window Setup
   */
  var WIDTH = 360;
  var HEIGHT = 640;
  browser.driver.manage().window().setSize(WIDTH, HEIGHT);


  /**
   * Helpers
   */
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


  /**
   * Custom Actions
   */
  // from https://stackoverflow.com/a/25519113
  var ElementFinder = $('').constructor;
  var ElementArrayFinder = $$('').constructor;

  ElementArrayFinder.prototype.getProperty = function(property) {
    function getProperty(element, property) {
      return element[property];
    }

    function getPropertyFn(webElem) {
      return webElem.getDriver().executeScript(
          getProperty, webElem, property);
    }

    return this.applyAction_(getPropertyFn);
  };

  ElementFinder.prototype.getProperty = function(property) {
    return this.elementArrayFinder_.getProperty(property).toElementFinder_();
  };

  ElementArrayFinder.prototype.setInputText = function(text) {
    function setInputText(element, text) {
      element.value = text;
      element.els.input.dispatchEvent(new CustomEvent('input'));
    }

    function setInputTextFn(webElem) {
      return webElem.getDriver().executeScript(
          setInputText, webElem, text);
    }

    return this.applyAction_(setInputTextFn);
  };

  ElementFinder.prototype.setInputText = function(text) {
    return this.elementArrayFinder_.setInputText(text).toElementFinder_();
    // return this.getWebElement().then(setInputTextFn);
  };

  ElementArrayFinder.prototype.getInputText = function(text) {
    function getInputText(element, text) {
      return element.value;
    }

    function getInputTextFn(webElem) {
      return webElem.getDriver().executeScript(
          getInputText, webElem, text);
    }

    return this.applyAction_(getInputTextFn);
  };

  ElementFinder.prototype.getInputText = function(text) {
    return this.elementArrayFinder_.getInputText(text).toElementFinder_();
  };

});
