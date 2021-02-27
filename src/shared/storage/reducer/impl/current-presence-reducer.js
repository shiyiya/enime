import StateReducer from "../state-reducer";
import StateActions from "../../action/state-actions";

export default class CurrentPresenceReducer extends StateReducer {
  static INITIAL_STATE = {
    state: 0,
    player: {
      paused: false,
      anime: {
        title: undefined,
        episode: undefined
      }
    },
    startTimestamp: undefined,
    endTimestamp: undefined
  };

  constructor() {
    super();
  }

  name() {
    return "current-presence";
  }

  get(state, action) {
    if (!state) return CurrentPresenceReducer.INITIAL_STATE;
    if (!action) return state;

    switch (action.type.toLowerCase()) {
      case StateActions.UPDATE_CURRENT_PRESENCE:
        return {
          ...state,
          ...action.payload
        }
      default:
        return state;
    }
  }
}
