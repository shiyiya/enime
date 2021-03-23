import { exists, writeFile, getFile } from "../utilities";

import { CONFIG_NAME, SETTINGS } from "../../shared/settings/settings";
import StateActions from "../../shared/storage/action/state-actions";

export default new Proxy({

  init() {
    if (!exists(CONFIG_NAME)) {
      const def = {};
      for(let i in SETTINGS) {
        def[i] = {};
        for(let j in SETTINGS[i])
          def[i][j] = SETTINGS[i][j].default;
      }
      writeFile(global.config = def, CONFIG_NAME);
    }
    else global.config = getFile(CONFIG_NAME);
  },

  save() {
    writeFile(global.config, CONFIG_NAME);
    global.store.dispatch({
      type: StateActions.UPDATE_CONFIGURATION,
      payload: {
        ...global.config
      }
    })
  }
}, {

  get(t, p) {
    if (!global.config) t.init();
    if(t[p]) return t[p];
    if (!SETTINGS[p]) return undefined;

    return new Proxy(SETTINGS[p], {
      set(t, k, v, r) {
        if(t.choices && !t.choices.includes(v))
          throw new Error("Configuration edit on " + k + " in section " + p + " has been set invalidly. The choices are [" + t.choices + "] but '" + v + "' was inputted.");
        else if (typeof v !== typeof t.default)
          throw new Error("Configuration edit on " + k + " in section " + p + " set to invalid type. Expected '" + typeof t.default + "' but got '" + typeof v + "' with the actual value being: " + v + ". plsfix");

        global.config[p][k] = v; this.save();
      }
    });
  },
})
