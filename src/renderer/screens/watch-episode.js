import * as React from "react";
import {MpvPlayer} from "../components/player/mpv-player";
import { streamTorrent } from "../stream/torrent-stream";

export class WatchEpisode extends React.Component {
  constructor(props) {
    super(props);

    this.torrent = this.props.location.state.torrent;

    console.log(this.torrent)
    this.state = {
      ready: false,
      response: undefined
    }
  }

  componentDidMount() {
    streamTorrent(this.torrent).then(response => {
      if (response.success) {
        this.setState({
          ready: true,
          response: {
            port: response.port
          }
        })
      }
    })
      .catch(err => console.log(err))
  }

  render() {
    return (
      <div>
        {this.state.ready &&
        <MpvPlayer url={"http://localhost:" + this.state.response.port}/>
        }
      </div>
    )
  }
}
