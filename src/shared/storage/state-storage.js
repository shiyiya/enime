import { mainStateSyncEnhancer, rendererStateSyncEnhancer } from 'electron-redux'

import {applyMiddleware, combineReducers, compose, createStore} from "redux";

import WatchingAnimeReducer from "./reducer/impl/watching-anime-reducer";
export const WATCHING_ANIME = new WatchingAnimeReducer();

import RecentReleasesReducer from "./reducer/impl/recent-releases-reducer";
export const RECENT_RELEASES = new RecentReleasesReducer();

const reducers = {
  [WATCHING_ANIME.name()]: WATCHING_ANIME.get,
  [RECENT_RELEASES.name()]: RECENT_RELEASES.get
}

const initialStateRemote = {
  [WATCHING_ANIME.name()]: WatchingAnimeReducer.INITIAL_STATE,
  [RECENT_RELEASES.name()]: RecentReleasesReducer.INITIAL_STATE
}

export function configureStore(initialState, scope = 'main') {
  if (!initialState) initialState = initialStateRemote;

  let enhancers = [];

  if (scope === 'main') {
    enhancers = [
      mainStateSyncEnhancer()
    ]
  } else if (scope === 'renderer') {
    enhancers = [
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
