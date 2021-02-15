import * as React from "react";
import { useEffect, useRef, useState } from "react";
import EpisodeCard from "../card/episode-card";
import ScrollButton from "../scroll-button";

import providers from "../../../main/services/provider/providers";

export default function RecentEpisodes({ history, onPageFlip }) {

  const [recent, setRecent] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [page, setPage] = useState(1);
  const [atStartPos, setAtStartPos] = useState(true);
  const [stateData, setStateData] = useState(null);
  const episodeCards = useRef(null);

  const scrollPage = (direction) => {
    const cardsElement = episodeCards.current;
    if (direction === "right") {
      cardsElement.scrollLeft += cardsElement.clientWidth;
      setAtStartPos(false);
      onPageFlip();
    } else {
      cardsElement.scrollLeft -= cardsElement.clientWidth;
      setAtStartPos(cardsElement.scrollLeft <= cardsElement.clientWidth);
    }
  };

  useEffect(() => {
    providers.getTorrentProvider().recentReleases(page).then(result => {
      setRecent(result);
      setUpdated(true);
      setStateData(page);
    });
  }, []);


  return (
    <div className={"no-selection"}>
      <h1 className={"recent-episodes-title"}>Recent</h1>
      <div className={"episode-releases-container"}>
        <ScrollButton
          direction={"left"}
          scrollFunction={scrollPage}
          display={!atStartPos}
        />

        <div className={"episode-releases"} ref={episodeCards}>
          {updated && recent.map(element => {
            element = element[1][0];

            return (
              <EpisodeCard
                anime_name={element.name}
                episode_number={element.episode}
                link={element.link}
                history={history}
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
