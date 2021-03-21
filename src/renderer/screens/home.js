import * as React from "react";
import RecentEpisodes from "../components/container/recent-episodes";
import {useHistory} from "react-router-dom";
import {usePresence} from "../hooks/presence";
import {useEffect} from "react";
import PresenceState from "../../shared/presence/presence-state";

export default function Home() {
  let history = useHistory(), presence = usePresence(PresenceState.IDLE);

  useEffect(() => {
    presence.update();
  }, []);

  return (
    <div className={"home"}>
      <RecentEpisodes onPageFlip={() => console.log('onPageFlip called')}/>
      <button onClick={() => {
        history.push('/setting')
      }}/>
    </div>
  )
}
