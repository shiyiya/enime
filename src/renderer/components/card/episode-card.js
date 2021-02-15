import * as React from "react";

import providers from "../../../main/services/provider/providers";
import { withRouter } from 'react-router-dom';
import EpisodeCardLoader from "./episode-card-loader";

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
      .seek(this.anime_name)
      .then(result => {
        this.setState({
          updated: true,
          data: result
        });
      })
  }

  render() {
    return (
      <div className={"episode-card"} onClick={() => {
        this.props.history.push({
          pathname: "/watch-episode",
          state: {
            torrent: this.torrent,
            anime: this.state.data,
            episode: this.episode_number
          }
        })
      }}>
        {!this.state.updated &&
        <EpisodeCardLoader/>
        }
        {this.state.updated &&
        <><img draggable={false} src={this.state.data.thumbnail.large} alt={this.state.data.title.primary}
               className={"episode-preview-thumbnail"}/>
          <div className={"episode-preview-title-container"}>
            <div className={"episode-preview-anime-name"}>{this.state.data.title.primary}</div>
            <div className={"episode-preview-title"}>Episode {this.episode_number}</div>
          </div>
        </>
        }
      </div>
    )
  }
}

export default withRouter(EpisodeCard);
