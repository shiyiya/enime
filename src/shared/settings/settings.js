import Anilist from "../../renderer/external/anilist";

export const CONFIG_NAME = "config.json";
export const SETTINGS = {
  providers: {
    torrent: {
      title: "Torrent Source",
      desc: "Where we download the torrent files from, to get you the anime. Usually doesn't matter much.",
      default: "animetosho",
      choices: ["animetosho", "nyaa.si"],
    },
    information: {
      title: "Anime Information",
      desc: "Where to get anime info like descriptions, anime id, thumbnails, and a ton of other stuff.",
      default: "notify.moe",
      choices: ["notify.moe"],
    }
  },
  integrations: {
    rpc: {
      default: true,
      change: v => global.events.emit("rpc", v),
      title: "Discord RPC",
      desc: "Turns Discord RPC on and off. Discord RPC is the small message under your profile that displays the anime you are watching, how long, and how far you're into it."
    },
    account: {
      default: "anilist", choices: ["anilist"],
      title: "Account and Watch List",
      desc: "What online service we sync your account and watch list information to."
    }
  },
  tokens: {
    anilist: {
      default: "",
      title: "AniList",
      desc: "The provided token the app uses to access your AniList account data and modify watch list.",
      oauth: {
        text: "Login with AniList",
        auth: async () => await Anilist.login()
      }
    }
  }
};
