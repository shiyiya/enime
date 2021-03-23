import { rakun } from "../../../../utilities";
import xmlParser from "fast-xml-parser"
import request from "request-promise"

import TorrentProvider from "../torrent-provider.js";

const allowedSubs = [
  //"SubsPlease",
  "Erai-raws",
  "HorribleSubs"
]

const BASE_URL = "https://feed.animetosho.org/json?filter%5B0%5D%5Bt%5D=nyaa_class&filter%5B0%5D%5Bv%5D=trusted&page={page}";
const SEARCH_URL = "https://feed.animetosho.org/json?&filter%5B0%5D%5Bt%5D=nyaa_class&filter%5B0%5D%5Bv%5D=trusted&q={query}&page={page}";

export default class Animetosho extends TorrentProvider {
  constructor() {
    super();
  }

  name() {
    return "Animetosho";
  }

  recentReleases(page) {
    return new Promise((resolve, reject) => {
      request.get(BASE_URL.replace("{page}", page || "1"))
        .then(json => this.extractInfoFromJSON(JSON.parse(json)))
        .then(result => resolve(result))
        .catch(error => reject(error))
    })
  }

  search(query, page) {
    return new Promise((resolve, reject) => {
      request.get(SEARCH_URL.replaceAll("{query}", query).replaceAll("{page}", page))
        .then(json => this.extractInfoFromJSON(JSON.parse(json)))
        .then(result => resolve(result))
        .catch(error => reject(error))
    })
  }

  extractInfoFromJSON(json) {
    let result = {};

    for (let torrent of json) {
      let information = rakun.parse(torrent.torrent_name);
      if (!allowedSubs.includes(information.subber)) continue;

      const key = information.name + "###" + information.season;
      let entries = result[key] || [];

      entries.push({
        original_name: torrent.title,
        name: information.name,
        episode: information.episode,
        season: information.season,
        link: torrent.torrent_url,
        resolution: information.resolution.replaceAll("p", ""),
        seeders: torrent.seeders,
        leechers: torrent.leechers
      });

      entries = entries.sort((a, b) => -(Number.parseInt(a.resolution) - Number.parseInt(b.resolution)));

      result[key] = entries;
    }

    return  Object.entries(result);
  }
}
