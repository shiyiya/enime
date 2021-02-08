import Nyaa from "./torrent/impl/nyaa";
import config from "../../config/config";
import NotifyMoe from "./information/impl/notify-moe";

let torrentProvider = null, informationProvider = null;

export default {
  getTorrentProvider() {
    if (!torrentProvider) {
      switch (config.getMainConfiguration().providers.torrent.toLowerCase()) {
        case "nyaa.si":
          torrentProvider = new Nyaa();
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
      switch (config.getMainConfiguration().providers.information.toLowerCase()) {
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
