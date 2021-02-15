import StateReducer from "../state-reducer";

const NAME = "torrent-watching";

export default class WatchingTorrentReducer extends StateReducer {
  constructor() {
    super();
  }

  name() {
    return NAME;
  }

  get(torrent = null) {
    return {
      type: NAME,
      payload: torrent
    }
  }
}
