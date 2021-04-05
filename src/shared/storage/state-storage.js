import { mainStateSyncEnhancer, rendererStateSyncEnhancer } from 'electron-redux'

import {applyMiddleware, combineReducers, compose, createStore} from "redux";

import WatchingAnimeReducer from "./reducer/impl/watching-anime-reducer";
const WATCHING_ANIME = new WatchingAnimeReducer();

import RecentReleasesReducer from "./reducer/impl/recent-releases-reducer";
const RECENT_RELEASES = new RecentReleasesReducer();

import CurrentPresenceReducer from "./reducer/impl/current-presence-reducer";
const CURRENT_PRESENCE = new CurrentPresenceReducer();

const reducers = {
  [WATCHING_ANIME.name()]: WATCHING_ANIME.get,
  [RECENT_RELEASES.name()]: RECENT_RELEASES.get,
  [CURRENT_PRESENCE.name()]: CURRENT_PRESENCE.get
};

const initialStateRemote = {
  [WATCHING_ANIME.name()]: WatchingAnimeReducer.INITIAL_STATE,
  [RECENT_RELEASES.name()]: RecentReleasesReducer.INITIAL_STATE,
  [CURRENT_PRESENCE.name()]: CurrentPresenceReducer.INITIAL_STATE
}

export function configureStore(initialState, scope = 'main') {
  if (!initialState) initialState = initialStateRemote;

  let enhancers = [], middlewares = [];

  const middlewareEnhancer = applyMiddleware(...middlewares);

  enhancers.push(middlewareEnhancer);

  if (scope === 'main') {
    enhancers = [
      ...enhancers,
      mainStateSyncEnhancer()
    ]
  } else if (scope === 'renderer') {
    enhancers = [
      ...enhancers,
      rendererStateSyncEnhancer()
    ]
  }

  const reducer = combineReducers(reducers);

  let composeEnhancers;

  if (scope === 'renderer') {
    composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
  } else {
    composeEnhancers = compose;
  }

  const enhancer = composeEnhancers(...enhancers);

  return createStore(
    reducer,
    initialState,
    enhancer
  );
}
