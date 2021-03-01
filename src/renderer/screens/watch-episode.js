import * as React from "react";
import MpvPlayer from "../components/player/mpv-player";
import {useHistory} from "react-router-dom";
import {useDispatch, useStore} from "react-redux";
import StateActions from "../../shared/storage/action/state-actions";
import {useEffect, useState} from "react";

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

  const [prevPlayerData, setPrevPlayerData] = useState({
    duration: 0,
    position: 0,
    paused: false
  });

  const player = React.createRef();

  return (
    <div>
      <MpvPlayer ref={player} url={"http://localhost:8888/" + torrent} handlePropertyChange={(name, value) => {
        if (name === 'pause' || name === 'duration' || name === 'time-pos') {
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
            if (value !== prevPlayerData.paused) {
              setPrevPlayerData({
                ...prevPlayerData,
                paused: value
              });
              activity.startTimestamp = value ? null : now + prevPlayerData.position * 1000;
              activity.endTimestamp = value ? null : now + (prevPlayerData.duration - prevPlayerData.position) * 1000;
            }

            dispatch({
              type: StateActions.UPDATE_CURRENT_PRESENCE,
              payload: activity
            })
          }

          if (!prevPlayerData.paused && (name === 'duration' || name === 'time-pos')) {
            if ((name === 'duration' && Math.abs(value - prevPlayerData.duration) > 1) || (name === 'time-pos' && Math.abs(value - prevPlayerData.position) > 1)) {
              let updatedData = prevPlayerData;

              if (name === 'duration') updatedData.duration = value;
              if (name === 'time-pos') updatedData.position = value;

              activity.startTimestamp = now + updatedData.position * 1000;
              activity.endTimestamp = now + (updatedData.duration - updatedData.position) * 1000;

              dispatch({
                type: StateActions.UPDATE_CURRENT_PRESENCE,
                payload: activity
              })

              setPrevPlayerData({
                ...prevPlayerData,
                ...updatedData
              })
            }
          }
        }
      }}/>
      <button className={"back"} onClick={() => {
        history.push({
          pathname: "/"
        })
      }}>Back</button>
    </div>
  )
}
