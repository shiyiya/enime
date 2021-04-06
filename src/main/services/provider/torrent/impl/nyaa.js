import { rakun } from "../../../../utilities";
import xmlParser from "fast-xml-parser"
import request from "request-promise"

import TorrentProvider from "../torrent-provider.js";

const allowedSubs = [
  //"SubsPlease",
  "Erai-raws",
  "HorribleSubs"
]

const BASE_URL = "https://nyaa.si/?page=rss&f=2&c=1_2&q=&p=";
const SEARCH_URL = "https://nyaa.si/?page=rss&f=2&c=1_2&q={query}&p={page}";

export default class Nyaa extends TorrentProvider {
  constructor() {
    super();
  }

  name() {
    return "Nyaa";
  }

  recentReleases(page) {
    return new Promise((resolve, reject) => {
      this.readXML(BASE_URL)
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
          return xmlParser.parse(response);
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
      let information = rakun.parse(torrent.title);
      if (!allowedSubs.includes(information.subber)) continue;

      const key = information.name + "###" + information.season;
      let entries = result[key] || [];
      entries.push({
        original_name: torrent.title,
        name: information.name,
        episode: information.episode,
        season: information.season,
        link: torrent.link,
        resolution: information.resolution.replaceAll("p", ""),
        seeders: torrent['nyaa:seeders'],
        leechers: torrent['nyaa:leechers']
      });

      entries = entries.sort((a, b) => -(Number.parseInt(a.resolution) - Number.parseInt(b.resolution)));

      result[key] = entries;
    }

    return Object.entries(result);
  }
}
