import * as React from "react";
import EpisodeCard from "../card/episode-card";
import ScrollButton from "../scroll-button";

import providers from "../../../main/services/provider/providers";

export default class RecentEpisodes extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      recent: [],
      updated: false,
      page: 1
    };
    this.episodeCards = React.createRef();
    this.scrollActionID = 0;
  }

  componentDidMount() {
    providers.getTorrentProvider().recentReleases(this.state.page).then(result => {
      this.setState({
        recent: result,
        updated: true,
        state: this.state.page
      });
    });
  }

  scrollPage = (direction) => {
    if (direction === "right") {
      this.episodeCards.current.scrollLeft += this.episodeCards.current.clientWidth
      this.props.onPageFlip();
    } else {
      this.episodeCards.current.scrollLeft -= this.episodeCards.current.clientWidth
    }
  };

  render() {
    return (
      <div className={"no-selection"}>
        <h1 className={"recent-episodes-title"}>Recent</h1>
        <div className={"episode-releases-container"}>
          <ScrollButton direction={"left"} scrollFunction={this.scrollPage} />

          <div className={"episode-releases"} ref={this.episodeCards}>
            {this.state.updated && this.state.recent.map(element => {
              element = element[1][0];

              return (
                <EpisodeCard
                  anime_name={element.name}
                  episode_number={element.episode}
                  link={element.link}
                  history={this.props.history}
                />);
            })}
          </div>

          <ScrollButton direction={"right"} scrollFunction={this.scrollPage}/>
        </div>
      </div>
    );
  }
}
