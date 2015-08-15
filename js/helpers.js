/*jshint esnext:true*/

function mixin(target, source) {
  for (var key in source) {
    if (typeof target[key] === 'function') {
      target[key] = source[key];
    } else {
      Object.defineProperty(target, key,
          Object.getOwnPropertyDescriptor(source, key));
    }
  }
  return target;
}

function toHyphenSeparated(string) {
  return string.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

var toast = function (text, parent) {
  var toast = new this['gaia-toast']();
  toast.innerHTML = text;
  toast.timeout = 2000;
  if (!parent) { parent = document.body; }
  parent.appendChild(toast);
  toast.show();
  window.setTimeout(toast.remove.bind(toast), 3000);
};

function addLongPressListener(element, clickAction, longPressAction) {
  const TOUCH_MOVE_THRESH = 10; // virtual pixels
  const LONG_PRESS_TIME = 200;  // ms

  var pressing;
  var pressTimer;
  var touchX;
  var touchY;
  var mouseDisabled;

  var down = function() {
    pressing = true;
    pressTimer = window.setTimeout(function() {
      pressing = false;
      longPressAction();
    }, LONG_PRESS_TIME);
  };

  var up = function() {
    if (pressing) {
      pressing = false;
      clearTimeout(pressTimer);
      clickAction();
    }
  };

  var ignoreMouseEvents = function() {
    if (!mouseDisabled) {
      element.removeEventListener('mousedown', down);
      element.removeEventListener('mouseup', up);
      mouseDisabled = true;
    }
  };

  element.addEventListener('mousedown', down);
  element.addEventListener('mouseup', up);

  element.addEventListener('touchstart', function(evt) {
    ignoreMouseEvents();
    touchX = evt.changedTouches[0].screenX;
    touchY = evt.changedTouches[0].screenY;
    down();
  });

  element.addEventListener('touchend', function(evt) {
    evt.preventDefault();
    up();
  });

  element.addEventListener('touchmove', function(evt) {
    if (Math.abs(evt.changedTouches[0].screenX - touchX) > TOUCH_MOVE_THRESH ||
        Math.abs(evt.changedTouches[0].screenY - touchY) > TOUCH_MOVE_THRESH) {
      clearTimeout(pressTimer);
      pressing = false;
    }
  });
}
