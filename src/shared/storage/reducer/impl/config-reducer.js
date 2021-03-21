import StateReducer from "../state-reducer";
import StateActions from "../../action/state-actions";
import { DEFAULT_CONFIGURATION } from "../../../settings/settings";

export default class ConfigReducer extends StateReducer {
  static INITIAL_STATE = {
    ...DEFAULT_CONFIGURATION
  }

  constructor() {
    super();
  }

  name() {
    return "config";
  }

  get(state, action) {
    if (!state) return ConfigReducer.INITIAL_STATE;
    if (!action) return state;

    switch (action.type.toLowerCase()) {
      case StateActions.UPDATE_CONFIGURATION:
        return {
          ...state,
          ...action.payload
        }
      default:
        return state;
    }
  }
}
