import StateReducer from "../state-reducer";
import StateActions from "../../action/state-actions";
import { SETTINGS } from "../../../settings/settings";

export default class ConfigReducer extends StateReducer {

  constructor() {
    super();
  }

  name() {
    return "config";
  }

  get(state, action) {
    if (!state) return {};
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
