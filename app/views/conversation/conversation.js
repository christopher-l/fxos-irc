'use strict';

var conversation = angular.module('irc.views.conversation', [
  'irc.views.conversation.completion',
]);


conversation.controller('ConversationCtrl', ['$scope', 'settings',
    function($scope, settings) {
  $scope.fontSize = settings.data.fontSize;
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

conversation.directive('ircMessageInput', [function() {
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

  function link(scope, element, attrs) {
    var model = $parse(attrs.ircMessages);
    if (!model(scope)) { model.assign(scope, {}); }
    function scrollDown() {
      element[0].scrollTo(0, element[0].scrollHeight);
    }
    model(scope).scrollDown = scrollDown;
    setTimeout(scrollDown);
    angular.element($window).bind('resize', scrollDown);
  }
  return {
    restrict: 'A',
    link: link
  };
}]);
