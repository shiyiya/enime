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
      volume: 0,
      tracks: {}
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
    this.seeking = false;
    this.pw = 0;

    this.indexToIdMap = {};
  }

  componentDidMount() {
    this.mpv.setPluginNode();
    document.addEventListener('keydown', this.handleKeyDown, false);
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown, false);
  }

  destroy() {
    this.mpv.destroy();
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
    ['pause', 'time-pos', 'duration', 'eof-reached', 'time-remaining', 'percent-pos', 'demuxer-cache-duration', 'volume', 'mute', 'track-list/count'].forEach(observe);

    const initialProperties = {
      hwdec:  'auto',
      scale: 'bilinear',
      cscale: 'bilinear',
      dscale: 'bilinear',
      'scale-antiring': 0,
      'cscale-antiring': 0,
      'dither-depth': 'no',
      'correct-downscaling': 'no',
      'sigmoid-upscaling': 'no',
      deband: 'no',
      hwaccel: 'auto',
      'blend-subtitles': 'yes',
      'osd-bar': 'no',
      ytdl: 'no',
      profile: 'low-latency',
      pause: this.state.pause
    }

    for (let property in initialProperties) {
      this.mpv.property(property, initialProperties[property]);
    }

    this.mpv.command('loadfile', this.url);
  }

  handlePropertyChange(name, value) {
    if (name === 'track-list/count') {
      if (value <= 0) return;

      for (let i = 0; i <= value; i++) {
        this.mpv.observe(`track-list/${i}/id`);
      }
    } else if (/track-list\/\d+/.test(name)) {
      const parts = name.split('/'), index = parts[1], type = parts[2];

      console.log(index, type, value);

      let tracks = this.state.tracks;

      if (type === 'id') {
        this.indexToIdMap[index] = value;
        this.mpv.observe(`track-list/${index}/type`);
      } else if (type === 'type') {
        let currentTrack = tracks[this.indexToIdMap[index]] || {};

        currentTrack.types = currentTrack.types || {};

        currentTrack.types[index] = {
          type: value
        }

        this.mpv.observe(`track-list/${index}/lang`);
        this.mpv.observe(`track-list/${index}/default`);
        this.mpv.observe(`track-list/${index}/type`);
        this.mpv.observe(`track-list/${index}/src`);
        this.mpv.observe(`track-list/${index}/title`);
        this.mpv.observe(`track-list/${index}/lang`);
        this.mpv.observe(`track-list/${index}/selected`);

        if (!tracks[this.indexToIdMap[index]]) tracks[this.indexToIdMap[index]] = currentTrack;
      } else {
        let currentTrack = tracks[this.indexToIdMap[index]];
        currentTrack.types[index] = {
          ...currentTrack.types[index],
          [type]: value
        }
      }

      this.setState({
        ...this.state,
        tracks: tracks
      })
    } else if (name === 'time-pos' && this.seeking) {
    } else if (name === 'eof-reached' && value) {
      this.mpv.property('time-pos', 0);
    } else {
      this.setState({ [name]: value });
      this.handlePropertyChangeExternal(name, value);
    }
  }

  selectTrack(index) {
    if (index > Object.keys(this.state.tracks).length - 1) return;

    this.mpv.property('sid', index);
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
    // console.log('seek but down');
    this.down = true;
    // console.log(this.handleSeekMove(e));
    this.slidemx(e);
    let { currentTarget: target } = e; target = target.lastChild;
    // console.log(target.clientWidth , target.parentNode.clientWidth, this.state.duration);
    this.playmove((target.clientWidth / target.parentNode.clientWidth) * this.state.duration);
  }

  handleSeekMove(e) { /* // console.log("move"); */ if(!this.down) return; return this.slidemx(e); }

  slidemx(e) { let { currentTarget: target } = e; target = target.lastChild; return this.pw = target.style.width = e.nativeEvent.offsetX + "px"; }

  handleSeek(e) {
    // console.log('seek');
    //this.handleSeekMove(e);
    let { currentTarget: target } = e; target = target.lastChild;
    // console.log(target.clientWidth , target.parentNode.clientWidth);
    this.playmove((target.clientWidth / target.parentNode.clientWidth) * this.state.duration);
    this.down = false;
  }

  // Moves the player position
  playmove (time) { this.setState({ 'time-pos': time }); this.mpv.property('time-pos', time); }

  zero(val) { return val < 10 ? "0" + val : val; }

  render() {
    const Embed = React.createElement(
      'embed',
      this.mpv.getDefProps({
        className: 'player',
        onMouseDown: this.togglePause,
      })
    );
    let width = this.state.duration ? this.state["time-pos"] * 100 / this.state.duration : 0;
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
            <div className="player-control-slider-buffer" style={{ width: Math.min(95, width + (this.state["demuxer-cache-duration"]) * 100 / this.state.duration) + "%" }}/>
            <div className="player-control-slider-before" style={this.down ? { width: this.pw } : { width: width + "%" }}><div className="player-control-slider-ball"/></div>
          </div>
          <div className="bottom">
            <div className="player-control-left">
              <div className={`control-playstate${!this.state.pause ? " paused" : ""}`} onClick={this.togglePause}/>
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
