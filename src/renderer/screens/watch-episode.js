import * as React from "react";
import MpvPlayer from "../components/player/mpv-player";
import {useHistory} from "react-router-dom";
import {useDispatch, useStore} from "react-redux";
import StateActions from "../../shared/storage/action/state-actions";
import {useEffect, useRef, useState} from "react";

export default function WatchEpisode(props) {
  const history = useHistory();
  const dispatch = useDispatch(), store = useStore();

  if (!props.location.state) {
    history.push({
      pathname: "/"
    });
    return;
  }

  const [currentProp, setCurrentProp] = useState({});
  let index = props.location.state.index || 0;
  let torrent = props.location.state.torrent;
  let anime = props.location.state.anime;
  let episode = props.location.state.episode;

  useEffect(() => {
    let updatedProp;

    if (torrent && anime && episode) {
      dispatch({
        type: StateActions.UPDATE_CURRENT_ANIME,
        payload: {
          props: anime,
          episode: episode,
          source: {
            type: 'torrent',
            link: torrent
          }
        }
      })

      updatedProp = {
        torrent: torrent,
        anime: anime,
        episode: episode
      };

      setCurrentProp(updatedProp);
    }

    if (!torrent || !anime || !episode) {
      let data = store.getState()['watching-anime'];
      updatedProp = {
        torrent: data.source.link,
        anime: data.props,
        episode: data.episode
      };

      setCurrentProp(updatedProp)
    }

    if (!updatedProp.torrent || !updatedProp.anime || !updatedProp.episode) {
      return history.push({
        pathname: '/'
      });
    }
  }, []);

  const [playerData, setPlayerData] = useState({
    duration: 0,
    position: 0,
    remaining: 0,
    paused: false
  });

  const [fetchedMetadata, setFetchedMetadata] = useState(false);

  fetch('http://localhost:8888/metadata/' + torrent)
    .then(response => {
      setFetchedMetadata(true);
    })

  const player = useRef();

  return (
    <div>
      {fetchedMetadata && <MpvPlayer ref={player} url={"http://localhost:8888/read/" + index + "/" + torrent} handlePropertyChange={(name, value) => {
        if (name === 'pause' || name === 'duration' || name === 'time-pos' || name === 'time-remaining') {
          const now = Date.now();

          let activity = {
            state: 1,
            player: {
              anime: {
                title: anime.title.primary,
                episode: episode
              },
              paused: false
            }
          };

          if (name === 'pause') {
            if (value) activity.player.paused = value;
            if (value !== playerData.paused) {
              setPlayerData({
                ...playerData,
                paused: value
              });
              activity.startTimestamp = value ? null : now + Math.ceil(playerData.position) * 1000;
              activity.endTimestamp = value ? null : now + Math.ceil(playerData.remaining) * 1000;
            }

            dispatch({
              type: StateActions.UPDATE_CURRENT_PRESENCE,
              payload: activity
            })
          }

          if (!playerData.paused && (name === 'duration' || name === 'time-pos') || name === 'time-remaining') {
            if ((name === 'duration' && Math.abs(value - playerData.duration) > 1) || (name === 'time-pos' && Math.abs(value - playerData.position) > 1) || (name === 'time-remaining' && Math.abs(value - playerData.remaining) > 1)) {
              let updatedData = playerData;

              if (name === 'duration') updatedData.duration = value;
              if (name === 'time-pos') updatedData.position = value;
              if (name === 'time-remaining') updatedData.remaining = value;

              activity.startTimestamp = now + Math.ceil(updatedData.position) * 1000;
              activity.endTimestamp = now + Math.ceil(updatedData.remaining) * 1000;

              dispatch({
                type: StateActions.UPDATE_CURRENT_PRESENCE,
                payload: activity
              })

              setPlayerData({
                ...playerData,
                ...updatedData
              })
            }
          }
        }
      }}/>}
      <button className={"back"} onClick={() => {
        if (player.current) player.current.destroy();
        history.push({
          pathname: "/"
        })
      }}>Back</button>
    </div>
  )
}
