import * as React from "react";

import providers from "../../../main/services/provider/providers";
import { withRouter } from 'react-router-dom';

class EpisodeCard extends React.Component {
  constructor(props) {
    super(props);
    this.episode_number = this.props.episode_number;
    this.anime_name = this.props.anime_name;
    this.torrent = this.props.link;

    this.state = {
      thumbnail: null,
      thumbnailUpdated: false
    }
  }

  componentDidMount() {
    providers.getInformationProvider()
      .information(this.anime_name)
      .then(result => {
        this.setState({
          thumbnail: result.thumbnail.medium,
          thumbnailUpdated: true
        })
      })
  }

  render() {
    return (
      <div className={"episode-card"} onClick={() => {
        this.props.history.push({
          pathname: "/watch-episode",
          state: {
            torrent: this.torrent
          }
        })
      }}>
        {this.state.thumbnailUpdated && <img draggable={false} src={this.state.thumbnail} alt={this.anime_name} className={"episode-preview-thumbnail"}/>}
        <div className={"episode-preview-title-container"}>
          <div className={"episode-preview-anime-name"}>{this.anime_name}</div>
          <div className={"episode-preview-title"}>Episode {this.episode_number}</div>
        </div>
      </div>
    )
  }
}

export default withRouter(EpisodeCard);
