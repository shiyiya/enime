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
    this.handleSeekMove = this.handleSeekMove.bind(this);
    this.handlePropertyChangeExternal = this.props.handlePropertyChange;
    this.mpv = new MpvJs(this.handleMPVReady, this.handlePropertyChange);
    this.url = props.url;
    this.buffering = false;
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
    ['pause', 'time-pos', 'duration', 'eof-reached', 'percent-pos', 'media-title', 'demuxer-cache-duration', 'demuxer-cache-idle', 'volume', 'mute', 'name'].forEach(observe);
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
      if (name === 'demuxer-cache-idle') console.log('buffering', this.bufferring = value);
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

  handleSeekMouseDown(e) {
    this.down = true;
    this.handleSeekMove(e);
    this.handleSeek(e);
    this.down = true;
  }

  handleSeekMove(e) {
    if(!this.down) return;
    let { target } = e;
    if(target.className === "player-control-slider") target = target.lastChild;
    target.style.width = e.nativeEvent.offsetX + "px";
  }

  handleSeek(e) {
    //e.target.blur();
    let { target } = e; 
    if(target.className === "player-control-slider") target = target.lastChild;
    const timePos = (target.clientWidth / target.parentNode.clientWidth) * this.state.duration;
    this.setState({ 'time-pos': timePos }); 
    this.mpv.property('time-pos', timePos);
    this.handleSeekMove(e);
    this.down = false;
  }

  zero(val) { return val < 10 ? "0" + val : val; }

  render() {
    const Embed = React.createElement(
      'embed',
      this.mpv.getDefProps({
        className: 'player',
        onMouseDown: this.togglePause,
      })
    );
    let width = this.state.duration ? (this.state["time-pos"] * 100 / this.state.duration).toFixed(1) + "%" : "0px";
    return (
      <div className="episode">
        <div className="episode-page">
          {Embed}
        </div>
        <div className="player-control top">
          <div
            className="player-control-slider"
            //onClick={e => (this.handleSeekMove(e), this.handleSeek(e))}
            onMouseDown={this.handleSeekMouseDown}
            onMouseMove={this.handleSeekMove}
            onMouseUp={this.handleSeek}
            > 
            <div className="player-control-slider-buffer" style={{ left: width, width: (this.state["demuxer-cache-duration"] - this.state["time-pos"]) * 100 / this.state.duration + "%" }}></div>
            <div className="player-control-slider-before" style={this.down ? {} : { width: width }}><div className="player-control-slider-ball"></div></div>
          </div>
          <div className="bottom">
            <div className="player-control-left">
            <div className={"control-playstate" + this.state.paused ? " paused" : ""} onClick={this.togglePause}></div>
            <div className="player-info-time">{Math.floor(this.state["time-pos"] / 60)}:{this.zero(Math.round(this.state["time-pos"] % 60))} / {~~(this.state.duration / 60)}:{this.zero(Math.round(this.state.duration % 60))}</div>
            </div>
            <div className="volume">
              <button className="volume-control" onClick={this.toggleMute}>
                { this.state.mute ? <FontAwesomeIcon icon={faVolumeMute}/> : <FontAwesomeIcon icon={
                  this.state.volume <= 0 ? faVolumeOff :
                  this.state.volume <= 65 ? faVolumeDown : faVolumeUp
                }/> }
              </button>
              <input
                className="volume-slider"
                type="range"
                min="0"
                step="1"
                max="130"
                value={this.state['volume']}
                onChange={this.handleVolume}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}
