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
      page: 1,
      atInitialCardPos: true
    };
    this.episodeCards = React.createRef();
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
    const cardsElement = this.episodeCards.current;
    if (direction === "right") {
      cardsElement.scrollLeft += cardsElement.clientWidth;
      this.props.onPageFlip();
      this.setState({
        atInitialCardPos: false
      })
    } else {
      cardsElement.scrollLeft -= cardsElement.clientWidth;
      this.setState({
        atInitialCardPos: cardsElement.scrollLeft <= cardsElement.clientWidth
      });
    }
  };

  render() {
    return (
      <div className={"no-selection"}>
        <h1 className={"recent-episodes-title"}>Recent</h1>
        <div className={"episode-releases-container"}>
          <ScrollButton
            direction={"left"}
            scrollFunction={this.scrollPage}
            display={!this.state.atInitialCardPos}
          />

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

          <ScrollButton
            direction={"right"}
            scrollFunction={this.scrollPage}
            display={true}
          />
        </div>
      </div>
    );
  }
}
