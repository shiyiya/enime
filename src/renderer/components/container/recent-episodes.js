import * as React from "react";
import EpisodeCard from "../card/episode-card";
import ScrollButton from "../scroll-button";

import providers from "../../../main/services/provider/providers";
import {useEffect, useState} from "react";

export default function RecentEpisodes(props) {

  const [recent, setRecent] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [page, setPage] = useState(1);
  const [atInitialCardPosition, setAtInitialCardPosition] = useState(false);

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
      setAtInitialCardPosition(false);
    } else {
      cardsElement.scrollLeft -= cardsElement.clientWidth;
      setAtInitialCardPosition(cardsElement.scrollLeft <= cardsElement.clientWidth);
    }
  };

  return (
    <div className={"no-selection"}>
      <h1 className={"recent-episodes-title"}>Recent</h1>
      <div className={"episode-releases-container"}>
        <ScrollButton
          direction={"left"}
          scrollFunction={scrollPage}
          display={!atInitialCardPosition}
        />

        <div className={"episode-releases"} ref={episodeCards}>
          {updated && recent.map(element => {
            element = element[1][0];

            return (
              <EpisodeCard
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
