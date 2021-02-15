import { forwardToMain, replayActionRenderer, getInitialStateRenderer } from 'electron-redux';
import {applyMiddleware, combineReducers, compose, createStore} from "redux";

import WatchingTorrentReducer from "../../shared/impl/watching-torrent-reducer";
import {composeWithDevTools} from "redux-devtools-extension";
export const WATCHING_TORRENT = new WatchingTorrentReducer();

const reducers = [
  WATCHING_TORRENT.get,
]

const app = combineReducers(reducers);

const composeEnhancers = composeWithDevTools(WATCHING_TORRENT.get());

const store = createStore(
  app,
  composeEnhancers(
    applyMiddleware(
      forwardToMain
    )
  )
);

replayActionRenderer(store);

export function getStore() {
  return store;
}
