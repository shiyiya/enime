import * as React from "react";
import {MpvPlayer} from "../components/player/mpv-player";
import { ipcRenderer } from 'electron';
import {useHistory} from "react-router-dom";
import {useDispatch, useStore} from "react-redux";
import StateActions from "../../shared/storage/action/state-actions";

export default function WatchEpisode(props) {
  const history = useHistory();
  const dispatch = useDispatch(), store = useStore();

  if (!props.location.state) {
    history.push({
      pathname: "/"
    });
    return;
  }

  let torrent = props.location.state.torrent;
  let anime = props.location.state.anime;
  let episode = props.location.state.episode;

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
  }

  if (!torrent || !anime || !episode) {
    let data = store.getState();
    torrent = data.source.link;
    anime = data.props;
    episode = data.episode;
  }

  if (!torrent || !anime || !episode) {
    history.push({
      pathname: '/'
    });
    return;
  }

  const prevPlayerData = {
    duration: 0,
    position: 0,
    paused: true
  }

  const player = React.createRef();

  return (
    <div>
      <MpvPlayer ref={player} url={"http://localhost:8888/" + torrent} handlePropertyChange={(name, value) => {
        if (name === 'pause' || name === 'duration' || name === 'time-pos') {
          const now = Date.now();

          let activity = {
            status: 1,
            anime: anime,
            episode: episode
          };

          if (name === 'pause') {
            if (value) activity.paused = value;
            if (value !== prevPlayerData.paused) {
              prevPlayerData.paused = value;
              activity.startTimestamp = value ? null : now + prevPlayerData.position * 1000;
              activity.endTimestamp = value ? null : now + (prevPlayerData.duration - prevPlayerData.position) * 1000;
            }
            ipcRenderer.invoke('enime:presence-status', activity);
          }

          if (!prevPlayerData.paused && (name === 'duration' || name === 'time-pos')) {
            if ((name === 'duration' && Math.abs(value - prevPlayerData.duration) > 1) || (name === 'time-pos' && Math.abs(value - prevPlayerData.position) > 1)) {
              if (name === 'duration') prevPlayerData.duration = value;
              if (name === 'time-pos') prevPlayerData.position = value;

              activity.startTimestamp = now + prevPlayerData.position * 1000;
              activity.endTimestamp = now + (prevPlayerData.duration - prevPlayerData.position) * 1000;

              ipcRenderer.invoke('enime:presence-status', activity);
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
