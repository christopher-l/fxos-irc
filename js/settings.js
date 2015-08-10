(function() {
/*jshint esnext:true*/

var List = require('irc-list');

var settings = new List();
settings.title = "IRC Settings";
settings.innerHTML = `
  <h2>Interface</h2>
  <gaia-list>
    <li class="ripple">
      <i data-icon="themes"></i>
      <label flex flexbox for="theme-switch">
        <div class=gaia-item-title>
          Dark Theme
          <!-- <p>Requires application restart</p> -->
        </div>
      </label>
      <gaia-switch id="theme-switch"></gaia-switch>
    </li>
    <li>
      <gaia-slider id="font-size-slider" flex>
        <label>Font Size</label>
        <output></output>
      </gaia-slider>
    </li>
  </gaia-list>
  <style>
    gaia-slider {
      margin: 0px !important;
    }
    gaia-slider output::after {
      content: 'pt' !important;
    }
  </style>
`;

var els = {
  statusBarTheme: document.head.querySelector('meta[name=theme-group]'),
  statusBarColor: document.head.querySelector('meta[name=theme-color]'),
  body: document.querySelector('body'),
  themeSwitch: settings.querySelector('#theme-switch'),
  fontSizeSlider: settings.querySelector('#font-size-slider')
};

/*
 * Theme
 */
var switchTheme = function(theme) {
  if (!theme) { return; }
  localStorage.theme = theme;
  els.themeSwitch.checked = theme === 'dark';
  settings.updateTheme();
  var themes = {
    'light': 'theme-communications',
    'dark': 'theme-media'
  };
  var newTheme = themes[theme];
  els.statusBarTheme.setAttribute('content', newTheme);
  // Force update of statusbar color
  document.head.removeChild(els.statusBarTheme);
  document.head.removeChild(els.statusBarColor);
  document.head.appendChild(els.statusBarTheme);
  document.head.appendChild(els.statusBarColor);
  els.body.setAttribute('class', newTheme);
};

switchTheme(localStorage.theme);

els.themeSwitch.addEventListener('change', function(e) {
  var state = e.target.checked;
  var theme = state ? 'dark' : 'light';
  switchTheme(theme);
});

/*
 * Font Size
 */
els.fontSizeSlider.els.input.setAttribute('min', '6');
els.fontSizeSlider.els.input.setAttribute('max', '20');
els.fontSizeSlider.els.input.setAttribute('value', '12');
els.fontSizeSlider.updateOutput();

function openSettings() {
  document.body.appendChild(settings);
}

var settingsButton = document.querySelector('#settings-button');
settingsButton.addEventListener('click', openSettings);

})();
