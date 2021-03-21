const CONFIG_NAME = "config.json";

const DEFAULT_CONFIGURATION = {
  providers: {
    torrent: "animetosho",
    information: "notify.moe"
  },
  integrations: {
    anilist: {
      enabled: true,
      token: undefined
    }
  }
};

export {
  CONFIG_NAME,
  DEFAULT_CONFIGURATION
}

