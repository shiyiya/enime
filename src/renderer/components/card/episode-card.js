import * as React from "react";
import { useEffect, useState } from "react";

import providers from "../../../main/services/provider/providers";
import { withRouter } from "react-router-dom";
import EpisodeCardLoader from "./episode-card-loader";

function EpisodeCard({ episode_number, anime_name, link: torrent, history }) {
  const [thumbnail, setThumbnail] = useState(null);
  const [thumbnailUpdated, setThumbnailUpdated] = useState(false);
  const [updated, setUpdated] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    providers.getInformationProvider()
      .seek(anime_name)
      .then(result => {
        setUpdated(true);
        setData(result);
      });
  }, []);

  return data && (
    <div className={"episode-card"} onClick={() => {
      history.push({
        pathname: "/watch-episode",
        state: {
          torrent: torrent,
          anime: data,
          episode: episode_number
        }
      });
    }}>
      {!updated && <EpisodeCardLoader />}
      {updated &&
      <>
        <img draggable={false} src={data.thumbnail.large} alt={data.title.primary}
             className={"episode-preview-thumbnail"} />
        <div className={"episode-preview-title-container"}>
          <div className={"episode-preview-anime-name"}>{data.title.primary}</div>
          <div className={"episode-preview-title"}>Episode {episode_number}</div>
        </div>
      </>
      }
    </div>
  );
}

export default withRouter(EpisodeCard);
