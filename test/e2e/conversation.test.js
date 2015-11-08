'use strict';

describe('conversation', function() {

  var view = $('#conversation-view');
  var messages = view.$('#messages');
  var messageInput = view.$('gaia-text-input-multiline');

  function receiveMessage() {
    view.evaluate(`
      MC.room.receive('McDoodle', 'Baaar');
    `);
  }

  function sendMessage(message) {
    messageInput.setFieldText(message || 'Fufufu');
    view.evaluate('onSubmit()');
    view.evaluate('$digest()');
  }

  function loadOnlineChannel() {
    browser.driver.get(url + '/Foo/channel1');
  }

  function loadOfflineChannel() {
    browser.driver.get(url + '/Foo/channel2');
  }

  function loadOnlineNetwork() {
    browser.driver.get(url + '/Foo/');
  }

  function loadOfflineNetwork() {
    browser.driver.get(url + '/Bar/');
  }

  var url;

  beforeAll(function() {
    browser.get('');
    this.helpers.setDefaultNetworks();
    browser.get('#/Foo/channel1');
    browser.getCurrentUrl().then(function(currentUrl) {
      url = currentUrl.match(/^.*#/)[0];
    });
    for (var i=0; i<10; i++) {
      receiveMessage();
    }
  });

  beforeEach(function() {
    browser.driver.get(url);
  });

  describe('scrolling', function() {

    function isScrolledDown() {
      return messages.execute(function(messages) {
        return messages.scrollTop ===
               messages.scrollHeight - messages.offsetHeight;
      });
    }

    function scrollDown() {
      messages.execute(function(messages) {
        messages.scrollTo(0, messages.scrollHeight);
      });
    }

    function scrollUp(pixels) {
      messages.execute(function(messages, pixels) {
        messages.scrollBy(0, -pixels);
      }, pixels);
    }

    function getScrollPosition() {
      return messages.execute(function(messages) {
        return messages.scrollTop;
      });
    }

    function decreaseWindowHeight(pixels) {
      browser.driver.manage().window().getSize().then(function(size) {
        browser.driver.manage().window().setSize(
            size.width, size.height - pixels);
      });
    }

    afterEach(function() {
      this.helpers.setWindowSize();
    });

    beforeEach(function() {
      // Reopen conversation window, but don't reload, so messages will be
      // preserved.
      loadOnlineChannel();
    });


    it('should scroll down on open', function() {
      expect(isScrolledDown()).toBe(true);
    });

    it('should scroll down, when size changes', function() {
      decreaseWindowHeight(10);
      expect(isScrolledDown()).toBe(true);
    });

    it('shoud not scroll on size change, when scrolled up', function() {
      scrollUp(10);
      expect(isScrolledDown()).toBe(false);
      var scrollPosition = getScrollPosition();
      decreaseWindowHeight(10);
      expect(getScrollPosition()).toBe(scrollPosition);
    });

    it('should scroll down on size change, when scrolled down', function() {
      scrollUp(10);
      scrollDown();
      decreaseWindowHeight(10);
      expect(isScrolledDown()).toBe(true);
    });

    it('should scroll down on new message', function() {
      receiveMessage();
      expect(isScrolledDown()).toBe(true);
    });

    it('should not scroll on new message, when scrolled up', function() {
      scrollUp(10);
      var scrollPosition = getScrollPosition();
      receiveMessage();
      expect(isScrolledDown()).toBe(false);
      expect(getScrollPosition()).toBe(scrollPosition);
    });

    it('should scroll down on new message, when scrolled down', function() {
      scrollUp(10);
      scrollDown();
      receiveMessage();
      expect(isScrolledDown()).toBe(true);
    });

    it('should scroll down on message sent', function() {
      sendMessage();
      expect(isScrolledDown()).toBe(true);
    });

    it('should scroll down on message sent, when scrolled up', function() {
      scrollUp(10);
      sendMessage();
      expect(isScrolledDown()).toBe(true);
    });

  });

  describe('message input', function() {

    it('should send a message when on online channel', function() {
      loadOnlineChannel();
      sendMessage('foobar');
      expect(messages.$$('.content').last().getText()).toBe('foobar');
    });

    it('should not be disabled when on online channel', function() {
      loadOnlineChannel();
      expect(messageInput.hasAttribute('disabled')).toBe(false);
    });

    it('should be disabled when on offline channel', function() {
      loadOfflineChannel();
      expect(messageInput.hasAttribute('disabled')).toBe(true);
    });

    it('should not be disabled when on online network', function() {
      loadOnlineNetwork();
      expect(messageInput.hasAttribute('disabled')).toBe(false);
    });

    it('should be disabled when on offline network', function() {
      loadOfflineNetwork();
      expect(messageInput.hasAttribute('disabled')).toBe(true);
    });

    // Cannot handle shadow dom yet
    // it('should enable / disable completeButton with input', function() {
    //   var completeButton = messageInput.$('button');
    //   loadOnlineChannel();
    //   expect(completeButton.hasAttribute('disabled')).toBe(false);
    //   loadOfflineChannel();
    //   expect(completeButton.hasAttribute('disabled')).toBe(true);
    // });

  });

  describe('userlist button', function() {

    var userlistButton = $('gaia-header').$('button');

    it('should be visible when on online channel', function() {
      loadOnlineChannel();
      expect(userlistButton.isDisplayed()).toBe(true);
    });

    it('should not be visible when on offline channel', function() {
      loadOfflineChannel();
      expect(userlistButton.isDisplayed()).toBe(false);
    });

    it('should not be visible when on network', function() {
      loadOnlineNetwork();
      expect(userlistButton.isDisplayed()).toBe(false);
      loadOfflineNetwork();
      expect(userlistButton.isDisplayed()).toBe(false);
    });

  });

});
