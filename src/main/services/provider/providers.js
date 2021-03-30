import Nyaa from "./torrent/impl/nyaa";
import NotifyMoe from "./information/impl/notify-moe";
import Animetosho from "./torrent/impl/animetosho";
import { isRenderer } from "../../../shared/utilities/process";
import { remote } from "electron";

let torrentProvider, informationProvider;

export default {
  getTorrentProvider() {
    if (!torrentProvider) {
      const config = isRenderer() ? remote.getGlobal('config') : global.config;

      switch (config.providers.torrent.toLowerCase()) {
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
      const config = isRenderer() ? remote.getGlobal('config') : global.config;

      switch (config.providers.information.toLowerCase()) {
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
