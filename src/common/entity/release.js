export default class Release {
  id;
  name;
  episode;
  season;
  resolutions;

  constructor(id, name, episode, season, resolutions) {
    this.id = id;
    this.name = name;
    this.episode = episode;
    this.season = season;
    this.resolutions = resolutions;
  }
}
