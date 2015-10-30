'use strict';

describe('conversation', function() {

  var view = $('#conversation-view');
  var messages = view.$('#messages');
  var messageInput = view.$('gaia-text-input-multiline');

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

  function receiveMessage() {
    view.evaluate(`
      messages.push({
        type: 'message',
        content: 'Baaaaar',
        user: 'McDoodle',
      });
    `);
  }

  function sendMessage() {
    messageInput.setFieldText('Fufufu');
    view.evaluate('onSubmit()');
    view.evaluate('$digest()');
  }

  function decreaseWindowHeight(pixels) {
    browser.driver.manage().window().getSize().then(function(size) {
      browser.driver.manage().window().setSize(
          size.width, size.height - pixels);
    });
  }

  var url;

  beforeAll(function() {
    browser.get('');
    this.helpers.setDefaultNetworks();
    browser.get('#/Foo/channel1');
    browser.getCurrentUrl().then(function(currentUrl) {
      url = currentUrl;
    });
    for (var i=0; i<10; i++) {
      view.evaluate(`
        messages.push({
          type: 'message',
          content: 'Fuuuuuu',
          user: 'McDoodle',
        });
      `);
    }
  });

  beforeEach(function() {
    // Reopen conversation window, but don't reload, so messages will be
    // preserved.
    browser.driver.get(url + 'foo');
    browser.driver.get(url);
  });

  afterEach(function() {
    this.helpers.setWindowSize();
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
