'use strict';

var conversation = angular.module('irc.views.conversation', [
  'irc.views.conversation.completion',
]);


conversation.directive('ircConversationView', [function() {
  return {
    restrict: 'E',
    templateUrl: 'views/conversation/conversation.html',
    controller: 'ConversationCtrl',
  };
}]);


conversation.controller(
    'ConversationCtrl', [
      '$rootScope',
      '$scope',
      '$timeout',
      '$stateParams',
      'networks',
      'settings',
      function($rootScope, $scope, $timeout, $stateParams, networks, settings) {

  var self = this;

  $scope.settings = settings.data;

  this.network = networks.find(function(network) {
    return network.name === $stateParams.network;
  });

  if (this.network) {
    this.channel = this.network.channels.find(function(channel) {
      return channel.name === $stateParams.channel;
    });
  }

  this.room = this.channel || this.network;

  if (this.channel) {
    $rootScope.title = '#' + this.channel.name;
  } else if (this.network) {
    $rootScope.title = this.network.name;
  }

  $scope.users = ['Fooooo', 'bar', 'baz'];
  $scope.messages = this.room.messages;

  $scope.onSubmit = function() {
    var message = {
      type: 'message',
      user: self.network.nick,
      time: new Date(),
      content: $scope.messageInput,
    };
    $scope.messages.push(message);
    $scope.messageInput = '';
    $timeout(() => $scope.messageView.scrollDown());
  };

  $scope.$watch('messages.length', function() {
    $timeout(() => $scope.messageView.onResize());
  });
}]);


conversation.directive(
    'ircFitHeight', [
      function() {
  function link(scope, element, attrs) {
    // from https://stackoverflow.com/a/995374
    var field = angular.element(element[0].els.field);
    var height = 0;

    function updateHeight() {
      field.css('height', '0px');
      var newHeight = field[0].scrollHeight + 2;
      if (newHeight !== height) {
        element.css('height', newHeight + 'px');
        scope.$eval(attrs.onResize);
      }
      field.css('height', '100%');
      height = newHeight;
    }

    field.css('min-height', '0px');
    field.attr('rows', '1');
    element[0].els.inner.querySelector('.focus-2').style.display = 'none';

    field.on('input', updateHeight);
    updateHeight();
  }
  return {
    restrict: 'A',
    link: link
  };
}]);

conversation.directive(
    'ircOnEnter', [
      function() {

  return {
    restrict: 'A',
    link: link
  };

  function link(scope, element, attrs) {
    var ENTER = 13;
    var field = angular.element(element[0].els.field);
    field.on('keydown', function(evt) {
      if (evt.which === ENTER) {
        scope.$apply(function() {
          scope.$eval(attrs.ircOnEnter);
        });
        evt.preventDefault();
        field.triggerHandler('input');
      }
    });
  }

}]);

conversation.directive(
    'ircMessages', [
      '$parse', '$window',
      function($parse, $window) {
  // Scroll down the element content initially.
  // Functions:
  //    onResize()   To be called when either the element's or the element's
  //                 content's height changes.
  //    scrollDown() Scroll down now.
  function link(scope, element, attrs) {
    var model = $parse(attrs.ircMessages);
    if (!model(scope)) { model.assign(scope, {}); }
    var maxScrollTop = 0;
    var userScrolled = false;
    function scrollDown() {
      element[0].scrollTo(0, element[0].scrollHeight);
    }
    function updateMaxScrollTop() {
      maxScrollTop = element[0].scrollHeight - element[0].offsetHeight;
    }
    function updateScrollPos() {
      if (!userScrolled) {
        scrollDown();
      }
    }
    function onResize() {
      updateMaxScrollTop();
      updateScrollPos();
    }
    model(scope).scrollDown = scrollDown;
    model(scope).onResize = onResize;
    setTimeout(onResize);
    angular.element($window).bind('resize', onResize);

    element.on('scroll', function() {
      userScrolled = element[0].scrollTop < maxScrollTop;
    });
  }
  return {
    restrict: 'A',
    link: link
  };
}]);
