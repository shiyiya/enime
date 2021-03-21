import * as React from "react";
import {useDispatch} from "react-redux";
import StateActions from "../../shared/storage/action/state-actions";
import PresenceState from "../../shared/presence/presence-state";

export function usePresence(state) {
  return new Presence(useDispatch(), state || PresenceState.IDLE);
}

class Presence {
  constructor(dispatch, state) {
    this.dispatch = dispatch;
    this.state = state;
  }

  update(payload) {
    if (payload) payload.state = this.state;

    payload = payload || {
      state: this.state
    }

    this.dispatch({
      type: StateActions.UPDATE_CURRENT_PRESENCE,
      payload: payload
    })
  }
}
