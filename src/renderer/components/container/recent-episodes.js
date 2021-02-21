import * as React from "react";
import EpisodeCard from "../card/episode-card";
import ScrollButton from "../scroll-button";

import providers from "../../../main/services/provider/providers";
import {useEffect, useState} from "react";

export default function RecentEpisodes(props) {

  const [recent, setRecent] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [page, setPage] = useState(1);
  const [atLeftBound, setAtLeftBound] = useState(true);

  const episodeCards = React.createRef();

  useEffect(() => {
    providers.getTorrentProvider().recentReleases(page).then(result => {
      setRecent(result);
      setUpdated(true);
      setPage(page);
    })
  }, []);

  const scrollPage = (direction) => {
    const cardsElement = episodeCards.current;
    if (direction === "right") {
      cardsElement.scrollLeft += cardsElement.clientWidth;
      props.onPageFlip();
      setAtLeftBound(false);
    } else {
      cardsElement.scrollLeft -= cardsElement.clientWidth;
      setAtLeftBound(cardsElement.scrollLeft <= cardsElement.clientWidth);
    }
  };

  return (
    <div className={"no-selection"}>
      <h1 className={"recent-episodes-title"}>Recent</h1>
      <div className={"episode-releases-container"}>
        <ScrollButton
          direction={"left"}
          scrollFunction={scrollPage}
          display={!atLeftBound}
        />

        <div className={"episode-releases"} ref={episodeCards}>
          {updated && recent.map(element => {
            element = element[1][0];

            return (
              <EpisodeCard
                key={element.name}
                anime_name={element.name}
                episode_number={element.episode}
                link={element.link}
                history={props.history}
              />);
          })}
        </div>

        <ScrollButton
          direction={"right"}
          scrollFunction={scrollPage}
          display={true}
        />
      </div>
    </div>
  );
}
