import * as React from "react";
import RecentEpisodes from "../components/container/recent-episodes";
import {useDispatch} from "react-redux";
import StateActions from "../../shared/storage/action/state-actions";
import {Link, Switch} from "react-router-dom";
import AnilistLogin from "../components/container/anilist-login";

export default function Home() {
  let dispatch = useDispatch();
  dispatch({
    type: StateActions.UPDATE_CURRENT_PRESENCE,
    payload: {
      state: 0
    }
  })
  return (
    <div className={"home"}>
      <RecentEpisodes onPageFlip={() => console.log('onPageFlip called')}/>
    </div>
  )
}
