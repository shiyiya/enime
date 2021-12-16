/**
 * Code taken from https://github.com/Kagami/mpv.js/issues/16#issuecomment-625829295
 */

export default class MPV {
  constructor(container, ready) {
    this.embed = document.createElement('embed');
    this.embed.id = 'mpv-player';
    this.embed.type = 'application/x-mpvjs';
    this.events = {
      'ready': ready
    };

    container.appendChild(this.embed);

    this.embed.addEventListener('message', this.recv.bind(this));
  }

  property(name, value) {
    const data = {name, value};
    this._postData("set_property", data);
  }

  recv(event) {
    const type = event.data.type;
    if (this.events[type]) {
      this.events[type].bind(this)(event);
    }
  }

  _postData(type, data) {
    const msg = {type, data};
    this.node().postMessage(msg);
  }

  command(cmd, ...args) {
    args = args.map(arg => arg.toString());
    this._postData("command", [cmd].concat(args));
  }

  observe(name) {
    this._postData("observe_property", name);
  }

  keypress(key)  {
    this.command("keypress", key);
  }

  node() {
    return document.getElementById('mpv-player');
  }

  on(event, listener) {
    this.events[event] = listener;
  }
}
