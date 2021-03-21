import React from 'react';
import {
  HashRouter,
  Route,
  Switch
} from "react-router-dom";
import 'v8-compile-cache';

import './App.global.sass';

import WatchEpisode from "./screens/watch-episode";
import Home from "./screens/home";
import { library } from '@fortawesome/fontawesome-svg-core';
import {faPlay, faPause, faVolumeMute, faVolumeUp, faVolumeDown, faVolumeOff} from "@fortawesome/free-solid-svg-icons";
import AnilistLogin from "./components/container/anilist-login";

library.add(faPlay, faPause, faVolumeMute, faVolumeUp, faVolumeDown, faVolumeOff);

export default function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/watch-episode" exact component={WatchEpisode} />
        <Route path="/integrations/anilist/login" component={AnilistLogin} />
      </Switch>
    </HashRouter>
  );
}
