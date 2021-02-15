import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { MpvPlayer } from "../components/player/mpv-player";
import { streamTorrent } from "../stream/torrent-stream";
import { ipcRenderer } from "electron";

export default function WatchEpisode({ history, location }) {

  const [ready, setReady] = useState(false);
  const [response, setResponse] = useState(undefined);

  if (!location.state) {
    history.push({
      pathname: "/"
    });
    return null;
  }

  // this stuff is below the if statement beccause i assume that the if statement short cicuits
  const [prevPlayerData, setPrevPlayerData] = useState({
    duration: 0,
    position: 0,
    paused: true
  });
  const player = useRef(null);

  useEffect(() => {
    if (location.state.torrent) {
      streamTorrent(location.state.torrent).then(response => {
        if (response.success) {
          setResponse({ port: response.port });
          setReady(true);

          ipcRenderer.invoke("enime:presence-status", {
            status: 1,
            anime: location.state.anime,
            episode: location.state.episode
          });
        }
      }).catch(err => console.log(err));
    }
  }, []);

  return (
    <div>
      {ready &&
      <MpvPlayer
        ref={player}
        url={"http://localhost:" + response.port}
        handlePropertyChange={(name, value) => {
          if (name === "pause" || name === "duration" || name === "time-pos") {
            const now = Date.now();

            let activity = {
              status: 1,
              anime: location.state.anime,
              episode: location.state.episode
            };

            if (name === "pause") {
              if (value) activity.paused = value;
              if (value !== prevPlayerData.paused) {
                prevPlayerData.paused = value;
                activity.startTimestamp = value ? null : now + prevPlayerData.position * 1000;
                activity.endTimestamp = value ? null : now + (prevPlayerData.duration - prevPlayerData.position) * 1000;
              }
              ipcRenderer.invoke("enime:presence-status", activity);
            }

            if (!prevPlayerData.paused && (name === "duration" || name === "time-pos")) {
              if ((name === "duration" && Math.abs(value - prevPlayerData.duration) > 1)
                || (name === "time-pos" && Math.abs(value - prevPlayerData.position) > 1)) {
                if (name === "duration") prevPlayerData.duration = value;
                if (name === "time-pos") prevPlayerData.position = value;

                activity.startTimestamp = now + prevPlayerData.position * 1000;
                activity.endTimestamp = now + (prevPlayerData.duration - prevPlayerData.position) * 1000;

                ipcRenderer.invoke("enime:presence-status", activity);
              }
            }
          }
        }} />
      }
      <button className={"back"} onClick={() => {
        history.push({
          pathname: "/"
        });
      }}>Back
      </button>
    </div>
  )
}
