import * as React from "react";
import {MpvPlayer} from "../components/player/mpv-player";
import { streamTorrent } from "../stream/torrent-stream";
import { ipcRenderer } from 'electron';

export class WatchEpisode extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ready: false,
      response: undefined
    }

    if (!this.props.location.state) {
      this.props.history.push({
        pathname: "/"
      });
      return;
    }

    this.torrent = this.props.location.state.torrent;
    this.anime = this.props.location.state.anime;
    this.episode = this.props.location.state.episode;

    this.prevPlayerData = {
      duration: 0,
      position: 0,
      paused: true
    }

    this.player = React.createRef();
  }

  componentDidMount() {
    if (this.torrent) {
      streamTorrent(this.torrent).then(response => {
        if (response.success) {
          this.setState({
            ready: true,
            response: {
              port: response.port
            }
          })

          ipcRenderer.invoke('enime:presence-status', {
            status: 1,
            anime: this.anime,
            episode: this.episode
          })
        }
      })
        .catch(err => console.log(err))
    }
  }

  render() {
    return (
      <div>
        {this.state.ready &&
        <MpvPlayer ref={this.player} url={"http://localhost:" + this.state.response.port} handlePropertyChange={(name, value) => {
          if (name === 'pause' || name === 'duration' || name === 'time-pos') {
            const now = Date.now();

            let activity = {
              status: 1,
              anime: this.anime,
              episode: this.episode
            };

            if (name === 'pause') {
              if (value) activity.paused = value;
              if (value !== this.prevPlayerData.paused) {
                this.prevPlayerData.paused = value;
                activity.startTimestamp = value ? null : now + this.prevPlayerData.position * 1000;
                activity.endTimestamp = value ? null : now + (this.prevPlayerData.duration - this.prevPlayerData.position) * 1000;
              }
              ipcRenderer.invoke('enime:presence-status', activity);
            }

            if (!this.prevPlayerData.paused && (name === 'duration' || name === 'time-pos')) {
              if ((name === 'duration' && Math.abs(value - this.prevPlayerData.duration) > 1) || (name === 'time-pos' && Math.abs(value - this.prevPlayerData.position) > 1)) {
                if (name === 'duration') this.prevPlayerData.duration = value;
                if (name === 'time-pos') this.prevPlayerData.position = value;

                activity.startTimestamp = now + this.prevPlayerData.position * 1000;
                activity.endTimestamp = now + (this.prevPlayerData.duration - this.prevPlayerData.position) * 1000;

                ipcRenderer.invoke('enime:presence-status', activity);
              }
            }
          }
        }}/>
        }
        <button className={"back"} onClick={() => {
          this.props.history.push({
            pathname: "/"
          })
        }}>Back</button>
      </div>
    )
  }
}
