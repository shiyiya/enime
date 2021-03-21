import {DEFAULT_CONFIGURATION} from "../../shared/settings/settings";
import {useDispatch, useStore} from "react-redux";
import StateActions from "../../shared/storage/action/state-actions";
import _ from "lodash";

export function useConfig() {
  const store = useStore(), dispatch = useDispatch();

  let currentConfig = DEFAULT_CONFIGURATION;

  store.subscribe(() => {
    let config = store.getState()['config'];

    if (!_.isEqual(currentConfig, config)) currentConfig = config;
  })

  return new Proxy(currentConfig, {
    get(target, p, receiver) {
      return Reflect.get(...arguments);
    },

    set(target, p, value, receiver) {
      Reflect.set(...arguments);
      dispatch({
        type: StateActions.UPDATE_CONFIGURATION,
        payload: {
          ...target
        }
      })
    }
  })
}
