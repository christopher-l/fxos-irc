'use strict';
/* global document, CustomEvent */

beforeAll(function() {

  /**
   * Window Setup
   */
  var WIDTH = 360;
  var HEIGHT = 640;
  setWindowSize();

  function setWindowSize() {
    browser.driver.manage().window().setSize(WIDTH, HEIGHT);
  }

  /**
   * Helpers
   */
  this.helpers = {
    setWindowSize: setWindowSize,
    setDefaultNetworks: function() {
      browser.executeScript(function() {
        /* global localStorage */
        /* jshint maxlen: false */
        localStorage.networks = '[{"config":{"name":"Foo","autoConnect":true,"port":6667,"host":"foo.com","nick":"foouser"},"channels":[{"config":{"name":"channel1","autoJoin":true}},{"config":{"name":"channel2"}}]},{"config":{"name":"Bar","host":"bar.com","tls":true,"nick":"baruser","port":6697},"channels":[{"config":{"name":"channel3","autoJoin":true}},{"config":{"name":"channel4"}}]}]';
      });
    },
    clickHeaderActionButton: function() {
      var header = $$('gaia-header').last().getWebElement();
      header.getDriver().executeScript(function(header) {
        header.onActionButtonClick();
      }, header);
    },
  };


  /**
   * Custom Actions
   */
  // from https://stackoverflow.com/a/25519113
  var ElementFinder = $('').constructor;
  var ElementArrayFinder = $$('').constructor;

  ElementArrayFinder.prototype.hasAttribute = function(attribute) {
    function hasAttribute(element, attribute) {
      return element.hasAttribute(attribute);
    }

    function hasAttributeFn(webElem) {
      return webElem.getDriver().executeScript(
          hasAttribute, webElem, attribute);
    }

    return this.applyAction_(hasAttributeFn);
  };

  ElementFinder.prototype.hasAttribute = function(attribute) {
    return this.elementArrayFinder_.hasAttribute(attribute).toElementFinder_();
  };

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

  ElementArrayFinder.prototype.execute = function(script, params) {
    function executeFn(webElem) {
      return webElem.getDriver().executeScript(
          script, webElem, params);
    }

    return this.applyAction_(executeFn);
  };

  ElementFinder.prototype.execute = function(script, params) {
    return this.elementArrayFinder_.execute(script, params).toElementFinder_();
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

  ElementArrayFinder.prototype.getInputText = function() {
    function getInputText(element) {
      return element.value;
    }

    function getInputTextFn(webElem) {
      return webElem.getDriver().executeScript(
          getInputText, webElem);
    }

    return this.applyAction_(getInputTextFn);
  };

  ElementFinder.prototype.getInputText = function() {
    return this.elementArrayFinder_.getInputText().toElementFinder_();
  };

  ElementArrayFinder.prototype.setFieldText = function(text) {
    function setFieldText(element, text) {
      element.value = text;
      element.els.field.dispatchEvent(new CustomEvent('input'));
    }

    function setFieldTextFn(webElem) {
      return webElem.getDriver().executeScript(
          setFieldText, webElem, text);
    }

    return this.applyAction_(setFieldTextFn);
  };

  ElementFinder.prototype.setFieldText = function(text) {
    return this.elementArrayFinder_.setFieldText(text).toElementFinder_();
  };

  // var ProtractorBy = by.constructor;
  //
  // ProtractorBy.prototype.shadowCss = function(selector) {
  //   function findByshadowCss(selector, using, rootSelector) {
  //     using = using || document;
  //     var elements = using.shadowRoot.querySelectorAll(selector);
  //     if (elements.length) {
  //       return elements;
  //     }
  //   }
  //
  //   return {
  //     findElementsOverride: function(driver, using, rootSelector) {
  //       return driver.findElements(
  //           protractor.By.js(findByshadowCss,
  //               selector, using, rootSelector));
  //     },
  //     toString: function toString() {
  //       return 'by.shadowCss("' + selector + '")';
  //     }
  //   };
  // };

});
