import {
  forwardToMain,
  replayActionRenderer,
  forwardToRenderer,
  replayActionMain
} from 'electron-redux';
import {applyMiddleware, combineReducers, compose, createStore} from "redux";

import { composeWithDevTools } from 'remote-redux-devtools';
import WatchingAnimeReducer from "./reducer/impl/watching-anime-reducer";
export const WATCHING_ANIME = new WatchingAnimeReducer();

const reducers = [
  WATCHING_ANIME.get,
]

const initialStateRemote = {
  ...WatchingAnimeReducer.INITIAL_STATE
}

export function configureStore(initialState, scope = 'main') {
  if (!initialState) initialState = initialStateRemote;

  let middleware = [];

  if (scope === 'main') {
    middleware = [
      ...middleware,
      forwardToRenderer,
    ];
  } else if (scope === 'renderer') {
    middleware = [
      forwardToMain,
      ...middleware,
    ];
  }

  const enhanced = [
    applyMiddleware(...middleware),
  ]

  const reducer = combineReducers(reducers);

  const enhancer = composeWithDevTools(...enhanced);

  const store = createStore(
    reducer,
    initialState,
    enhancer
  );

  if (scope === 'main') {
    replayActionMain(store);
  } else {
    replayActionRenderer(store);
  }

  return store;
}
