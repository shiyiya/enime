import util from "../utilities";

let configuration;

const CONFIG_NAME = "config.json";

const DEFAULT_CONFIGURATION = {
  providers: {
    torrent: "animetosho",
    information: "notify.moe"
  }
}

export default {
  get() {
    if (!configuration) {
      if (!util.file.exists(CONFIG_NAME)) {
        util.file.writeFile(DEFAULT_CONFIGURATION, CONFIG_NAME);
      }

      configuration = util.file.getFile(CONFIG_NAME);
    }

    return configuration;
  }
}
