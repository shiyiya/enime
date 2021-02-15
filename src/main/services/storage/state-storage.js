import { applyMiddleware, combineReducers, createStore } from "redux";

import { forwardToRenderer } from 'electron-redux';

import WatchingTorrentReducer from "../../../shared/impl/watching-torrent-reducer";
export const WATCHING_TORRENT = new WatchingTorrentReducer();
import { composeWithDevTools } from 'redux-devtools-extension';

const reducers = [
  WATCHING_TORRENT.get,
]

const app = combineReducers(reducers);

const store = createStore(
  app,
  composeWithDevTools(
    applyMiddleware(
      forwardToRenderer
    )
  )
);

store.subscribe(() => {
  console.log("ok")
})
export function getStore() {
  return store;
}
