'use strict';

var completion = angular.module('irc.views.conversation.completion', []);


completion.factory('completeString', [function() {
  var lastHit;

  function complete(str, pos, completions, cycling) {
    var part = str.toLowerCase();
    part = part.slice(0, pos);
    var left = part.search(/\S+$/);
    part = part.slice(left);
    var newStr;

    if (!cycling) {
      completions.some(function(user) {
        newStr = completeEntry(user);
        if (newStr) { return true; }
      });
      if (!newStr) {
        lastHit = false;
        return str;
      }
      return newStr;
    } else if (lastHit) {
      if (pos >= 2 && str.slice(pos-2, pos) === ', ') {
        left = 0;
        pos = pos - 2;
      }
      return [
        str.slice(0, left),
        cycle(lastHit),
        str.slice(pos)
      ].join('');
    } else {
      return str;
    }

    function cycle(current) {
      var index = completions.indexOf(current);
      index = (index + 1) % completions.length;
      var next = completions[index];
      lastHit = next;
      return next;
    }

    function completeEntry(entry) {
      var partEntry = entry.slice(0, part.length).toLowerCase();
      if (partEntry !== part) {
        return false;
      }
      lastHit = entry;
      var suffix = '';
      if (left <= 0) {
        suffix += ',';
        if (str.slice(pos, pos+1) !== ' ') {
          suffix += ' ';
        }
      }
      return [
        str.slice(0, left),
        entry,
        suffix,
        str.slice(pos)
      ].join('');
    }
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
      var newStr = completeString(oldStr, oldPos, completions, cycling);
      var newPos = oldPos + newStr.length - oldStr.length;
      input[0].value = newStr;
      input[0].setSelectionRange(newPos, newPos);
      input[0].focus();
      cycling = true;
    }

    var completions = $parse(attrs.ircComplete)(scope);
    var input = angular.element(element[0].els.input);
    var cycling = false;

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
      } else {
        cycling = false;
      }
    });
  }

  return {
    restrict: 'A',
    link: link
  };
}]);
