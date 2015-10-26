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
      '$stateParams',
      'networks',
      'settings',
      function($rootScope, $scope, $stateParams, networks, settings) {

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
    $scope.messageView.updateScrollPos();
  };
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
  //    updateScrollPos()   If the last position the user scrolled to was the
  //                        bottom, scroll to the bottom now.
  function link(scope, element, attrs) {
    var model = $parse(attrs.ircMessages);
    if (!model(scope)) { model.assign(scope, {}); }
    var maxScrollTop = 0;
    var userScrolled = false;
    function scrollDown() {
      element[0].scrollTo(0, element[0].scrollHeight);
    }
    function updateMaxScroll() {
      maxScrollTop = element[0].scrollHeight - element[0].offsetHeight;
    }
    function onResize() {
      updateMaxScroll();
      updateScrollPos();
    }
    function updateScrollPos() {
      if (!userScrolled) {
        scrollDown();
      }
    }
    model(scope).updateScrollPos = updateScrollPos;
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
