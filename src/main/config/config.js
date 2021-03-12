import util from "../utilities";
import fs from "fs";

let configuration = null;

const CONFIG_NAME = "config.json";

const DEFAULT_CONFIGURATION = {
  providers: {
    torrent: "animetosho",
    information: "notify.moe"
  }
}

export default {
  getMainConfiguration() {
    if (!configuration) {
      if (!fs.existsSync(CONFIG_NAME)) {
        util.file.writeFile(DEFAULT_CONFIGURATION, CONFIG_NAME);
      }

      configuration = util.file.getFile(CONFIG_NAME);
    }

    return configuration;
  }
}
