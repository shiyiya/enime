
import { CONFIG_NAME, SETTINGS } from "./settings.js";
import { exists, writeFile, getFile } from "../../main/utilities";
import StateActions from "../storage/action/state-actions";

// Saves and broadcasts global configuration changes.
function save() {
	writeFile(config, CONFIG_NAME);
	global.store.dispatch({
		type: StateActions.UPDATE_CONFIGURATION,
		payload: {
			...config
		}
	})
}

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
		save(); t[p] = v;
	}
});

// Gets the current configuration or gets a blank object to populate
let config;
if (exists(CONFIG_NAME)) config = getFile(CONFIG_NAME); else config = {};

// Inits the global config obj thing idk
global.config = {};

// Fills in default values for all the values that aren't filled already, and creates a proxy in the global object for those properties at the same time.
for(let i in SETTINGS) {
	console.log(i);
	global.config[i] = new Proxy(config[i] ||= {}, handle(SETTINGS[i]));
	for(let j in SETTINGS[i])
		if(!config[i][j]) config[i][j] = SETTINGS[i][j].default;
}

save();