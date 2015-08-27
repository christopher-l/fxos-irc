var Network = this['irc-network'];
var Channel = this['irc-channel'];
var ChannelConfig = this['irc-channel-config'];

describe("Channel", function() {
  beforeAll(function() {
    this.net = new Network();
  });

  beforeEach(function() {
    this.channel = new Channel(this.net);
    this.config = new ChannelConfig(this.channel);
  });

  it("is not added until saved", function() {
    expect(this.net.channels.length).toEqual(0);
  });

  it("is added when saved", function() {
    this.config.items.name.value = 'foo';
    this.config.saveButtonAction();
    expect(this.net.channels.length).toEqual(1);
  });
});


