import * as React from 'react';
import { MpvJs } from 'mpv.js-vanilla';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlay, faPause, faVolumeMute, faVolumeUp, faVolumeDown, faVolumeOff } from "@fortawesome/free-solid-svg-icons";

export default class MpvPlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pause: false,
      'time-pos': 0,
      duration: 0,
      fullscreen: false,
      mute: false,
      volume: 0
    };
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleMPVReady = this.handleMPVReady.bind(this);
    this.handlePropertyChange = this.handlePropertyChange.bind(this);
    this.toggleFullscreen = this.toggleFullscreen.bind(this);
    this.togglePause = this.togglePause.bind(this);
    this.toggleMute = this.toggleMute.bind(this);
    this.handleVolume = this.handleVolume.bind(this);
    this.handleSeek = this.handleSeek.bind(this);
    this.handleSeekMouseDown = this.handleSeekMouseDown.bind(this);
    this.handleSeekMouseUp = this.handleSeekMouseUp.bind(this);
    this.handlePropertyChangeExternal = this.props.handlePropertyChange;
    this.mpv = new MpvJs(this.handleMPVReady, this.handlePropertyChange);
    this.url = props.url;
  }

  componentDidMount() {
    this.mpv.setPluginNode();
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  handleKeyDown(e) {
    e.preventDefault();
    if (e.key === 'f' || (e.key === 'Escape' && this.state.fullscreen)) {
      this.toggleFullscreen();
    } else if (this.state.duration) {
      this.mpv.keypress(e);
    }
  }

  handleMPVReady(mpv) {
    const observe = mpv.observe.bind(mpv);
    ['pause', 'time-pos', 'duration', 'eof-reached', 'percent-pos', 'media-title', 'cache-buffering-state', 'paused-for-cache', 'volume', 'mute', 'name'].forEach(observe);
    this.mpv.property('hwdec', 'auto');
    this.mpv.property('pause', this.state.pause)
    this.mpv.property('profile', 'low-latency');
    this.mpv.command('loadfile', this.url);
  }

  handlePropertyChange(name, value) {
    if (name === 'time-pos' && this.seeking) {
    } else if (name === 'eof-reached' && value) {
      this.mpv.property('time-pos', 0);
    } else {
      if (name === 'cache-buffering-state') console.log('buffering', value)
      this.setState({ [name]: value });
      this.handlePropertyChangeExternal(name, value);
    }
  }

  toggleFullscreen() {
    if (this.state.fullscreen) {
      document.webkitExitFullscreen();
    } else {
      this.mpv.fullscreen();
    }
    this.setState({ fullscreen: !this.state.fullscreen });
  }

  togglePause(e) {
    e.target.blur();
    if (!this.state.duration) return;
    this.mpv.property('pause', !this.state.pause);
  }

  toggleMute(e) {
    e.target.blur();
    if (!this.state.duration) return;
    this.mpv.property('mute', !this.state.mute);
  }

  handleVolume(e) {
    e.target.blur();
    const targetVolume = +e.target.value;
    this.mpv.property('volume', targetVolume)
  }

  handleSeekMouseDown() {
    this.seeking = true;
  }

  handleSeek(e) {
    e.target.blur();
    const timePos = +e.target.value;
    this.setState({ 'time-pos': timePos });
    this.mpv.property('time-pos', timePos);
  }

  handleSeekMouseUp() {
    this.seeking = false;
  }

  render() {
    const Embed = React.createElement(
      'embed',
      this.mpv.getDefProps({
        className: 'player',
        onMouseDown: this.togglePause,
      })
    );
    return (
      <div className="episode-player">
        {Embed}
        <div className="episode-player-control">
          <input
            className="episode-player-control-slider"
            type="range"
            min={0}
            step={0.1}
            max={this.state.duration}
            value={this.state['time-pos']}
            onChange={this.handleSeek}
            onMouseDown={this.handleSeekMouseDown}
            onMouseUp={this.handleSeekMouseUp}
          />
          <button className="control" onClick={this.togglePause}>
            { this.state.pause ? <FontAwesomeIcon icon={faPlay}/> : <FontAwesomeIcon icon={faPause}/> }
          </button>
          <button className="control" onClick={this.toggleMute}>
            { this.state.mute ? <FontAwesomeIcon icon={faVolumeMute}/> : <FontAwesomeIcon icon={
              this.state.volume <= 0 ? faVolumeOff :
                this.state.volume <= 65 ? faVolumeDown : faVolumeUp
            }/> }
          </button>
          <input
            className="episode-player-control-slider"
            type="range"
            min={0}
            step={1}
            max={130}
            value={this.state.volume}
            onChange={this.handleVolume}
          />
        </div>
      </div>
    );
  }
}
