import StateReducer from "../state-reducer";
import StateActions from "../../action/state-actions";

export default class WatchingAnimeReducer extends StateReducer {
  static INITIAL_STATE = {
    anime: {
      props: null,
      episode: null,
      source: {
        type: 'torrent', // `torrent` or `direct`,
        source: null
      }
    }
  }

  constructor() {
    super();
  }

  get(state, action) {
    if (!state) return WatchingAnimeReducer.INITIAL_STATE;
    if (!action) return state;

    switch (action.type.toLowerCase()) {
      case StateActions.UPDATE_CURRENT_ANIME:
        return {
          ...state,
          anime: action.payload
        }
      default:
        return state;
    }
  }
}
