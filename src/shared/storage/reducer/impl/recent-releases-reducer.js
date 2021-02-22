import StateReducer from "../state-reducer";
import StateActions from "../../action/state-actions";

export default class RecentReleasesReducer extends StateReducer {
  static INITIAL_STATE = [];

  constructor() {
    super();
  }

  name() {
    return "recent-releases";
  }

  get(state, action) {
    if (!state) return RecentReleasesReducer.INITIAL_STATE;
    if (!action) return state;

    switch (action.type.toLowerCase()) {
      case StateActions.UPDATE_RECENT_RELEASES:
        return {
          ...state,
          ...action.payload
        }
      default:
        return state;
    }
  }
}
