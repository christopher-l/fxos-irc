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

conversation.directive('ircMessageInput', ['$compile', function($compile) {
  function link(scope, element, attrs) {
    var field = angular.element(element[0].els.field);
    // from https://stackoverflow.com/a/995374
    field.css({
      'min-height': '0px',
      'overflow': 'hidden',
    });
    field.attr('rows', '1');
    field.on('input', function(evt) {
      field.css('height', '0px');
      field.css('height', (field[0].scrollHeight) + 'px');
    });
    element[0].els.inner.querySelector('.focus-2').style.display = 'none';
  }
  return {
    restrict: 'A',
    link: link
  };
}]);
