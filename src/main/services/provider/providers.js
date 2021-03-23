import Nyaa from "./torrent/impl/nyaa";
import config from "../../config/config";
import NotifyMoe from "./information/impl/notify-moe";
import Animetosho from "./torrent/impl/animetosho";

let torrentProvider, informationProvider;

export default {
  getTorrentProvider() {
    if (!torrentProvider) {
      config.init();
      switch (global.config.providers.torrent.toLowerCase()) {
        case "nyaa.si":
          torrentProvider = new Nyaa();
          break;
        case "animetosho":
          torrentProvider = new Animetosho();
          break;
        default:
          console.error("The torrent information provider doesn't exist. Please pick a viable one...");
          break;
      }
    }

    return torrentProvider;
  },

  getInformationProvider() {
    if (!informationProvider) {
      config.init();
      switch (global.config.providers.information.toLowerCase()) {
        case "notify.moe":
          informationProvider = new NotifyMoe();
          break;
        default:
          console.error("The torrent information provider doesn't exist. Please pick a viable one...");
          break;
      }
    }

    return informationProvider;
  }
}
