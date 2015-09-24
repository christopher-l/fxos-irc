'use strict';

var conversation = angular.module('irc.views.conversation', [
  'irc.views.conversation.completion',
]);


conversation.controller('ConversationCtrl', ['$scope', function($scope) {
  $scope.users = ['Fooooo', 'bar', 'baz'];
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
