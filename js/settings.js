/*jshint esnext:true*/

var List = require('irc-list');

drawer.querySelector('#settings-button').addEventListener('click', function() {
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
            <p>Requires application restart</p>
          </div>
        </label>
        <gaia-switch id="theme-switch"></gaia-switch>
      </li>
    </gaia-list>
  `;
  document.body.appendChild(settings);
});
