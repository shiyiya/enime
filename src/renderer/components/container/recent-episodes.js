import * as React from "react";
import { useEffect, useRef, useState } from "react";
import EpisodeCard from "../card/episode-card";
import ScrollButton from "../scroll-button";
import ScrollContainer from "react-indiana-drag-scroll";
import { useStore } from "react-redux";
import _ from "lodash";

export default function RecentEpisodes(props) {

  const [recent, setRecent] = useState([]);
  const [updated, setUpdated] = useState(false);
  const [atLeftBound, setAtLeftBound] = useState(true);

  const scrollContainerRef = useRef();

  const store = useStore();

  const refreshRecent = () => {
    let previousRecent = recent;
    let currentRecent = store.getState()["recent-releases"];

    if (!_.isEqual(previousRecent, currentRecent)) {
      const values = Object.values(currentRecent);

      setRecent(values);
      if (values.length > 0) setUpdated(true);
    }
  };

  const unsubscribe = store.subscribe(refreshRecent);

  useEffect(() => {
    refreshRecent();

    return () => {
      unsubscribe();
    }
  }, []);

  const onScroll = (direction, targetElement) => {
    if (direction === "right") {
      props.onPageFlip();
      setAtLeftBound(false);
    } else {
      setAtLeftBound(targetElement.scrollLeft <= targetElement.clientWidth);
    }
  };

  return (
    <div className={"no-selection"}>
      <h1 className={"recent-episodes-title"}>Recent</h1>
      <div className={"episode-releases-container"}>
        <ScrollButton
          targetRef={scrollContainerRef}
          direction={"left"}
          display={!atLeftBound}
          onScroll={onScroll}
        />
        <ScrollContainer
          className={"episode-releases"}
          ref={scrollContainerRef}
          onEndScroll={() => {
            const targetElement = scrollContainerRef.current.getElement();
            setAtLeftBound(targetElement.scrollLeft === 0);
          }}
        >
          {updated && recent.map((element, index) => {

            element = element[1][0];

            return (
              <EpisodeCard
                key={index}
                anime_name={element.name}
                season={element.season}
                episode_number={element.episode}
                link={element.link}
                history={props.history}
              />);
          })}
        </ScrollContainer>
        <ScrollButton
          targetRef={scrollContainerRef}
          direction={"right"}
          display={true}
          onScroll={onScroll}
        />
      </div>
    </div>
  );
}
