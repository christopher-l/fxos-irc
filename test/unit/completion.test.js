'use strict';

describe('completion', function() {

  beforeEach(module('irc.views.conversation.completion'));

  var completeString;
  var completions = ['Foo', 'bar', 'baz'];

  beforeEach(inject(function(_completeString_) {
    completeString = _completeString_;
  }));

  it('should complete the empty string', function() {
    expect(completeString('', 0, completions)).toBe('Foo, ');
  });

  it('should complete part of a string', function() {
    expect(completeString('ba', 2, completions)).toBe('bar, ');
  });

  it('should ignore case', function() {
    expect(completeString('f', 1, completions)).toBe('Foo, ');
    expect(completeString('Ba', 2, completions)).toBe('bar, ');
  });

  it('should complete a complete string', function() {
    expect(completeString('foo', 3, completions)).toBe('Foo, ');
  });

  it('should not complete a non matching string', function() {
    expect(completeString('bl', 2, completions)).toBe('bl');
  });

  it('should complete in the middle of a string', function() {
    expect(completeString('foo ba baz', 6, completions)).toBe('foo bar baz');
  });

  it('should complete at the end of a string', function() {
    expect(completeString('foo ba', 6, completions)).toBe('foo bar');
  });

  it('should complete first word when in the middle', function() {
    expect(completeString('fo bar', 2, completions)).toBe('Foo, bar');
  });

  it('should cycle through all words', function() {
    var str = '';
    str = completeString(str, str.length, completions);
    expect(str).toBe('Foo, ');
    str = completeString(str, str.length, completions, true);
    expect(str).toBe('bar, ');
    str = completeString(str, str.length, completions, true);
    expect(str).toBe('baz, ');
    str = completeString(str, str.length, completions, true);
    expect(str).toBe('Foo, ');
  });

  it('should cycle through some words', function() {
    var str = 'ba';
    str = completeString(str, str.length, completions);
    expect(str).toBe('bar, ');
    str = completeString(str, str.length, completions, true);
    expect(str).toBe('baz, ');
    str = completeString(str, str.length, completions, true);
    expect(str).toBe('bar, ');
  });

  it('should cycle at the end of a string', function() {
    var str = 'foo ba';
    str = completeString(str, str.length, completions);
    expect(str).toBe('foo bar');
    str = completeString(str, str.length, completions, true);
    expect(str).toBe('foo baz');
    str = completeString(str, str.length, completions, true);
    expect(str).toBe('foo bar');
  });

  it('should not cycle on a non matching string', function() {
    var str = 'bl';
    str = completeString(str, str.length, completions);
    expect(str).toBe('bl');
    str = completeString(str, str.length, completions);
    expect(str).toBe('bl');
  });

});
