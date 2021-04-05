import React from 'react';
import { ipcRenderer } from 'electron';
import {
  HashRouter,
  Route,
  Switch
} from "react-router-dom";
import 'v8-compile-cache';
import './App.global.sass';

ipcRenderer.on("config", (_, config) => global.config = JSON.parse(config));
global.config = JSON.parse(await ipcRenderer.invoke("sendmeconfigyoufrick"));

import WatchEpisode from "./screens/watch-episode";
import Home from "./screens/home";
import Setting from "./screens/setting";
import { library } from '@fortawesome/fontawesome-svg-core';
import {faPlay, faPause, faVolumeMute, faVolumeUp, faVolumeDown, faVolumeOff} from "@fortawesome/free-solid-svg-icons";
console.log(global);
library.add(faPlay, faPause, faVolumeMute, faVolumeUp, faVolumeDown, faVolumeOff);

export default function App() {
  return (
    <HashRouter>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/watch-episode" exact component={WatchEpisode} />
        <Route path="/setting" exact component={Setting}/>
      </Switch>
    </HashRouter>
  );
}
