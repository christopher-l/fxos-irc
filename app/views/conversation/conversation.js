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
  $scope.messages = [
    {
      type: 'message',
      time: '18:46',
      user: 'Juliet',
      content: 'O Romeo, Romeo, wherefore art thou Romeo?',
      highlight: true,
    },
    {
      type: 'message',
      time: '18:47',
      user: 'Juliet',
      content: 'Deny thy father and refuse thy name;',
    },
    {
      type: 'message',
      time: '18:47',
      user: 'Juliet',
      content: 'Or if thou wilt not, be but sworn my love',
    },
    {
      type: 'message',
      time: '18:47',
      user: 'Juliet',
      content: 'And I\'ll no longer be a Capulet.',
    },
    {
      type: 'message',
      time: '18:49',
      user: 'Romeo',
      content: 'Shall I hear more, or shall I speak at this?',
    },
    {
      type: 'disconnect',
      time: '18:49',
      user: 'Juliet',
    },
  ];
}]);

conversation.directive(
    'ircMessageInput', [
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
