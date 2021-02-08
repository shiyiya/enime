import React from 'react';
import {
  HashRouter,
  Route
} from "react-router-dom";

import './App.global.css';

import {WatchEpisode} from "./screens/watch-episode";
import {Home} from "./screens/home";

export default function App() {
  return (
    <HashRouter>
      <div>
        <Route path="/" exact component={Home} />
        <Route path="/watch-episode" component={WatchEpisode} />
      </div>
    </HashRouter>
  );
}
