import Job from "../job";
import { EventEmitter } from "events";
import { exists, getFile, writeFile } from "../../../utilities";
import StateActions from "../../../../shared/storage/action/state-actions.js";
import { CONFIG_NAME, SETTINGS } from "../../../../shared/settings/settings.js";
import { ipcMain } from "electron";

export default class ConfigSync extends Job {
  constructor(props) {
    super(props);
  }

  name() {
    return "Initial Configuration Sync";
  }

  cron() {
    return null;
  }

  async run() {

    global.events = new EventEmitter();

    // Saves and broadcasts global configuration changes.
    function save() {
      writeFile(config, CONFIG_NAME);
    }

    // whether to save initial or not(in the case of there being values not filled in)
    let s;

    // Handler for every proxy thing
    const handle = def => ({
      get(t, p) {
        return t[p];
      },
      set(t, p, v) {
        if(def[p].choices && !def[p].choices.includes(v))
          throw new Error("Configuration edit on " + k + " in section " + p + " has been set invalidly. The choices are [" + t.choices + "] but '" + v + "' was inputted.");
        else if (typeof v !== typeof def[p].default)
          throw new Error("Configuration edit on " + k + " in section " + p + " set to invalid type. Expected '" + typeof t.default + "' but got '" + typeof v + "' with the actual value being: " + v + ". plsfix");
        if(t[p] !== v) { save(); t[p] = v; if(def[p].change) def[p].change(v); }
        return true;
      }
    });

    // Gets the current configuration or gets a blank object to populate
    let config;
    if (exists(CONFIG_NAME)) config = getFile(CONFIG_NAME); else config = {};

    // Inits the global config obj thing idk
    global.config = {};

    // Fills in default values for all the values that aren't filled already, and creates a proxy in the global object for those properties at the same time.
    for(let i in SETTINGS) {
      global.config[i] = new Proxy(config[i] ||= {}, handle(SETTINGS[i]));
      for(let j in SETTINGS[i])
        if(!config[i][j]) s = true, config[i][j] = SETTINGS[i][j].default;
    }

    // Literally just innocently sends the config object.
    ipcMain.handle("config-info", async () => JSON.stringify(global.config));
    ipcMain.handle("config-save", async (_, key, val) => {
      const [cat, kat] = key.split(".");
      try {
        global.config[cat][kat] = val;
        return true;
      } catch(e) { console.log("invalid imput for key " + key + ": " + val); return false; }
    });

    // Saves if needed
    if(s) save();
  }
}
