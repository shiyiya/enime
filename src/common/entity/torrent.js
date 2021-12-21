export default class Torrent {
  id;
  name;
  magnet_link;
  seeders;
  leechers;

  constructor(id, name, magnet_link, seeders, leechers) {
    this.id = id;
    this.name = name;
    this.magnet_link = magnet_link;
    this.seeders = seeders;
    this.leechers = leechers;
  }
}
