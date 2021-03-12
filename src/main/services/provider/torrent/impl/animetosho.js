import util from "../../../../utilities";
import xmlParser from "fast-xml-parser"
import request from "request-promise"

import TorrentProvider from "../torrent-provider.js";

const allowedSubs = [
  //"SubsPlease",
  "Erai-raws",
  "HorribleSubs"
]

const BASE_URL = "https://feed.animetosho.org/rss2?filter%5B0%5D%5Bt%5D=nyaa_class&filter%5B0%5D%5Bv%5D=trusted&page={page}";
const SEARCH_URL = "https://feed.animetosho.org/rss2?&filter%5B0%5D%5Bt%5D=nyaa_class&filter%5B0%5D%5Bv%5D=trusted&q={query}&page={page}";

export default class Animetosho extends TorrentProvider {
  constructor() {
    super();
  }

  name() {
    return "Animetosho";
  }

  recentReleases(page) {
    return new Promise((resolve, reject) => {
      this.readXML(BASE_URL.replace("{page}", page || "1"))
        .then(xml => this.extractInfoFromXML(xml))
        .then(result => resolve(result))
        .catch(error => reject(error))
    })
  }

  search(query, page) {
    return new Promise((resolve, reject) => {
      this.readXML(SEARCH_URL.replaceAll("{query}", query).replaceAll("{page}", page))
        .then(xml => this.extractInfoFromXML(xml))
        .then(result => resolve(result))
        .catch(error => reject(error))
    })
  }

  readXML(url) {
    return new Promise((resolve, reject) => {
      request.get(url)
        .catch(error => reject(error))
        .then(response => {
          return xmlParser.parse(response, {
            parseAttributeValue: true,
            ignoreAttributes: false
          });
        })
        .catch(error => reject(error))
        .then(parsedXML => {
          resolve(parsedXML);
        })
    })
  }

  extractInfoFromXML(parsedXML) {
    let result = {};

    for (let torrent of parsedXML.rss.channel.item) {
      let information = util.rakun.parse(torrent.title);
      if (!allowedSubs.includes(information.subber)) continue;

      const key = information.name + "###" + information.season;
      let entries = result[key] || [];

      entries.push({
        original_name: torrent.title,
        name: information.name,
        episode: information.episode,
        season: information.season,
        link: torrent.enclosure[0]['@_url'],
        resolution: information.resolution.replaceAll("p", "")
      });

      entries = entries.sort((a, b) => -(Number.parseInt(a.resolution) - Number.parseInt(b.resolution)));

      result[key] = entries;
    }

    return Object.entries(result);
  }
}
