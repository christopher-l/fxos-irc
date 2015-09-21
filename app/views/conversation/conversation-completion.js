'use strict';

var completion = angular.module('irc.views.conversation.completion', []);


completion.factory('completeString', [function() {
  function complete(str, pos, completions) {
    var part = str.toLowerCase();
    part = part.slice(0, pos);
    var left = part.search(/\S+$/);
    part = part.slice(left);
    var newStr;

    completions.some(function(user) {
      var partUser = user.slice(0, part.length).toLowerCase();
      if (partUser === part) {
        var suffix = '';
        if (left === 0) {
          suffix += ',';
        }
        if (str.slice(pos, pos+1) !== ' ') {
          suffix += ' ';
        }
        newStr = [
          str.slice(0, left),
          user,
          suffix,
          str.slice(pos)
        ].join('');
        return true;
      }
    });
    return newStr;
  }
  return complete;
}]);


completion.directive('ircComplete', [
    '$parse', 'completeString',
    function($parse, completeString) {

  function link(scope, element, attrs) {

    function complete() {
      var oldStr = input[0].value;
      var oldPos = input[0].selectionStart;
      var newStr = completeString(oldStr, oldPos, completions);
      var newPos = oldPos + newStr.length - oldStr.length;
      input[0].value = newStr;
      input[0].setSelectionRange(newPos, newPos);
      input[0].focus();
    }

    var completions = $parse(attrs.ircComplete)(scope);
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
        complete(input[0].value);
        evt.preventDefault();
      }
    });
  }

  return {
    restrict: 'A',
    link: link
  };
}]);
