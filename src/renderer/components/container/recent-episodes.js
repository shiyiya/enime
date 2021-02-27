import * as React from "react";
import EpisodeCard from "../card/episode-card";
import ScrollButton from "../scroll-button";

import {useEffect, useState} from "react";
import {useStore} from "react-redux";
import _ from 'lodash';

export default function RecentEpisodes(props) {

  const [recent, setRecent] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [atLeftBound, setAtLeftBound] = useState(true);

  const episodeCards = React.createRef();

  const store = useStore();

  let currentRecent;

  useEffect(() => refreshRecent(), []);

  const refreshRecent = () => {
    let previousRecent = currentRecent;
    currentRecent = store.getState()['recent-releases'];

    if (!_.isEqual(previousRecent, currentRecent)) {
      const values = Object.values(currentRecent);

      setRecent(values);
      if (values.length > 0) setUpdated(true);
    }
  }

  store.subscribe(refreshRecent);

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
