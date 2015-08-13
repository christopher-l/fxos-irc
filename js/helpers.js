function mixin(target, source) { // from gaia-components.js
  for (var key in source) {
    target[key] = source[key];
  }
  return target;
}
