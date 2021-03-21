import util from "../utilities";

import { CONFIG_NAME, DEFAULT_CONFIGURATION } from "../../shared/settings/settings";
import StateActions from "../../shared/storage/action/state-actions";

let configuration;

export default {
  get() {
    if (!configuration) {
      if (!util.file.exists(CONFIG_NAME)) {
        util.file.writeFile(DEFAULT_CONFIGURATION, CONFIG_NAME);
      }

      configuration = util.file.getFile(CONFIG_NAME);
    }

    return configuration;
  },

  set(section, key, value, save = true) {
    configuration[section][key] = value;
    if (save) this.save();
  },

  save() {
    util.file.writeFile(configuration, CONFIG_NAME);
    this.sync();
  },

  sync() {
    const store = global.store;

    store.dispatch({
      type: StateActions.UPDATE_CONFIGURATION,
      payload: {
        ...configuration
      }
    })
  }
}
