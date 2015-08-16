/*jshint esnext:true*/

var themeGroup = document.createElement('meta');
themeGroup.setAttribute('name', 'theme-group');
themeGroup.setAttribute('content', 'theme-communications');
document.head.appendChild(themeGroup);

var themeColor = document.createElement('meta');
themeColor.setAttribute('name', 'theme-color');
themeColor.setAttribute('content', 'var(--header-background)');
document.head.appendChild(themeColor);

var dom = document.createElement('div');
dom.id = 'main';
dom.innerHTML = `
  <gaia-header action="menu">
    <h1>IRC</h1>
    <button data-icon="contacts"></button>
  </gaia-header>

  <gaia-drawer>
    <div id="drawer-main">
      <section data-type="list" id="network-list">
        <!-- <irc-network-entry name="Foo">
          <irc-channel-entry>Channel asdfasdf asdfasdf asdfasdf</irc-channel-entry>
          <irc-channel-entry>Channel</irc-channel-entry>
        </irc-network-entry>
        <irc-network-entry name="Bar">
          <irc-channel-entry>Channel 2 1</irc-channel-entry>
          <irc-channel-entry>Channel 2 2</irc-channel-entry>
          <irc-channel-entry>Foo-Channel</irc-channel-entry>
        </irc-network-entry> -->
      </section>
      <div id="drawer-buttons">
        <gaia-button id="add-network-button"><i data-icon="add"></i></gaia-button>
        <gaia-button id="settings-button"><i data-icon="settings"></i></gaia-button>
      </div>
    </div>
  </gaia-drawer>

  <div id="content">
    <div>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec a diam lectus. Sed sit amet ipsum mauris. Maecenas congue ligula ac quam viverra nec consectetur ante hendrerit. Donec et mollis dolor. Praesent et diam eget libero egestas mattis sit amet vitae augue. Nam tincidunt congue enim, ut porta lorem lacinia consectetur. Donec ut libero sed arcu vehicula ultricies a non tortor. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean ut gravida lorem. Ut turpis felis, pulvinar a semper sed, adipiscing id dolor. Pellentesque auctor nisi id magna consequat sagittis. Curabitur dapibus enim sit amet elit pharetra tincidunt feugiat nisl imperdiet. Ut convallis libero in urna ultrices accumsan. Donec sed odio eros. Donec viverra mi quis quam pulvinar at malesuada arcu rhoncus. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. In rutrum accumsan ultricies. Mauris vitae nisi at sem facilisis semper ac in est.
    </div>
  </div>

  <div id=input>
    <!-- <gaia-button circular><i data-icon="user"></i></gaia-button> -->
    <gaia-text-input id="field" placeholder="Default"></gaia-text-input>
  </div>
`;

document.body.appendChild(dom);
