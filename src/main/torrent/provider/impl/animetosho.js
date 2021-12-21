import bent from 'bent';

import TorrentProvider from '../provider';
import { Logger } from '@nestjs/common';
import anitomy from 'anitomy-js';
import { hash } from "../../../../common/helper/hash";
import { compareResolution } from "../../../../common/helper/compare";

const BASE_URL = "https://feed.animetosho.org/json?filter%5B0%5D%5Bt%5D=nyaa_class&filter%5B0%5D%5Bv%5D=trusted&page={page}";
const SEARCH_URL = "https://feed.animetosho.org/json?&filter%5B0%5D%5Bt%5D=nyaa_class&filter%5B0%5D%5Bv%5D=trusted&q={query}&page={page}";

const get = bent('json');

export default class Animetosho extends TorrentProvider {
  logger = new Logger(Animetosho.name);

  constructor(configurationService) {
    super();
    this.configurationService = configurationService;
  }

  get name() {
    return 'Animetosho';
  }

  recentReleases(page) {
    return new Promise((resolve, reject) => {
      get(BASE_URL.replaceAll('{page}', page || '1'))
        .then(json => this.extractInfoFromJSON(json))
        .then(result => resolve(result))
        .catch(error => reject(error))
    })
  }

  search(query, page) {
    return new Promise((resolve, reject) => {
      get(SEARCH_URL.replaceAll('{query}', query).replaceAll('{page}', page))
        .then(json => this.extractInfoFromJSON(json))
        .then(result => resolve(result))
        .catch(error => reject(error))
    })
  }

  extractInfoFromJSON(json) {
    let result = new Map();

    for (let torrent of json) {
      let information = anitomy.parseSync(torrent.torrent_name);
      if (!this.configurationService.getConfiguration().get('torrent.allowedSubs').includes(information.release_group)) continue;

      const key = hash(`${information.anime_title}@${information.anime_season || '01'}`);

      const episodes = result.get(key) || [];
      episodes.push({
        name: information.anime_title,
        episode: information.episode_number || information.episode_number_alt,
        season: information.anime_season || '01',
        metadata: {
          info_hash: torrent.info_hash,
          original_name: torrent.title,
          link: torrent.torrent_url,
          seeders: torrent.seeders,
          leechers: torrent.leechers,
          resolution: information.video_resolution.toLowerCase().replace('p', '')
        }
      });
    }

    return new Map([...result].sort((a, b) => -(compareResolution(a.metadata.resolution, b.metadata.resolution))));
  }
}
