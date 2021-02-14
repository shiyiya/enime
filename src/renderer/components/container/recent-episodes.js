import * as React from "react";
import EpisodeCard from "../card/episode-card";

import providers from "../../../main/services/provider/providers";

export default class RecentEpisodes extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      recent: [],
      updated: false,
      page: 1
    }
  }

  componentDidMount() {
    providers.getTorrentProvider().recentReleases(this.state.page).then(result => {
      this.setState({
        recent: result,
        updated: true,
        state: this.state.page
      })
    })
  }

  render() {
    return (
      <div className={"no-selection"}>
        <h1 className={"recent-episodes-title"}>Recent</h1>
        <div className={"episode-releases-container"}>
          {this.state.updated && this.state.recent.map(element => {
            element = element[1][0];

            return (
              <EpisodeCard
                anime_name={element.name}
                episode_number={element.episode}
                link={element.link}
                history={this.props.history}
              />)
          })}
        </div>
      </div>
    )
  }
}
