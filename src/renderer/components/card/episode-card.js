import * as React from "react";

import providers from "../../../main/services/provider/providers";
import EpisodeCardLoader from "./episode-card-loader";
import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";

export default function EpisodeCard(props) {
  const episodeNumber = props.episode_number;
  const animeName = props.anime_name;
  const torrent = props.link;

  const history = useHistory();

  const [result, setResult] = useState({
    updated: false,
    data: null
  });

  useEffect(() => {
    providers.getInformationProvider()
      .seek(animeName)
      .then(result => {
        setResult({
          updated: true,
          data: result
        })
      })
  }, [])

  return (
    <div className={"episode-card"} onClick={() => {
      history.push({
        pathname: "/watch-episode",
        state: {
          torrent: torrent,
          anime: result.data,
          episode: episodeNumber
        }
      })
    }}>
      {!result.updated &&
      <EpisodeCardLoader/>
      }
      {result.updated &&
      <><img draggable={false} src={result.data.thumbnail.large} alt={result.data.title.primary}
             className={"episode-preview-thumbnail"}/>
        <div className={"episode-preview-title-container"}>
          <div className={"episode-preview-anime-name"}>{result.data.title.primary}</div>
          <div className={"episode-preview-title"}>Episode {episodeNumber}</div>
        </div>
      </>
      }
    </div>
  )
}
