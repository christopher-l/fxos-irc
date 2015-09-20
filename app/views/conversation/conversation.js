'use strict';

var conversation = angular.module('irc.views.conversation', []);


conversation.controller('ConversationCtrl', ['$scope', function($scope) {
  $scope.users = ['foo', 'bar', 'baz'];
}]);


conversation.directive('ircComplete', ['$parse', function($parse) {
  return {
    restrict: 'A',
    link: function(scope, element, attrs) {
      var completions = $parse(attrs.ircComplete)(scope);
      function complete() {
        var oldStr = input[0].value;
        var str = oldStr.toLowerCase();
        var pos = input[0].selectionStart;
        str = str.slice(0, pos);
        var left = str.search(/\S+$/);
        str = str.slice(left);

        completions.some(function(user) {
          var partUser = user.slice(0, str.length).toLowerCase();
          if (partUser === str) {
            var suffix = '';
            if (left === 0) {
              suffix += ',';
            }
            if (oldStr.slice(pos, pos+1) !== ' ') {
              suffix += ' ';
            }
            var newStr = [
              oldStr.slice(0, left),
              user,
              suffix,
              oldStr.slice(pos)
            ].join('');
            input[0].value = newStr;
            var newPos = left + user.length + suffix.length;
            input[0].setSelectionRange(newPos, newPos);
            input[0].focus();
            return true;
          }
        });
      }
      var input = angular.element(element[0].els.input);
      var completeButton =
          angular.element('<button>&#8677;</button>');
      completeButton.css({
        'position': 'absolute',
        'left': '.2rem',
        'top': '0px',
        'height': '38px',
        'padding-bottom': '2px',
        'font-size': '20px',
        'font-family': 'droid sans fallback',
        'background': 'none',
      });
      input.css('padding-left', '2rem');
      input.after(completeButton);
      completeButton.on('click', complete);
      input[0].addEventListener('keydown', function(evt) {
        var TABKEY = 9;
        if (evt.keyCode === TABKEY) {
          complete();
          evt.preventDefault();
        }
      });
    }
  };
}]);
