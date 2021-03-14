import util from "../utilities";

let localData;

const DATA_NAME = "series.json";

const OBSERVE_LIST = [
  'notifyMoeId',
  'anilistId',
  'malId'
]

export default {
  all() {
    if (!localData) {
      if (!util.file.existsSync(DATA_NAME)) {
        util.file.writeFile({}, DATA_NAME);
      }

      localData = util.file.getFile(DATA_NAME);
    }

    return localData;
  },

  exists(anime) {
    return !!this.get(anime);
  },

  get(anime) {
    let data = this.all(), indexed;

    if ((indexed = data[anime.title.primary])) return indexed;

    Object.values(data)
      .forEach(entry => {
        OBSERVE_LIST.forEach(observed => {
          if (entry.mappings[observed] === anime.mappings[observed]) return entry;
        })
      })
  },

  add(anime) {
    if (this.exists(anime)) return;

    let data = this.all();
    data[anime.title.primary] = {
      title: anime.title.primary,
      mappings: {
        notifyMoeId: anime.mappings.notifyMoeId,
        anilistId: anime.mappings.anilistId,
        malId: anime.mappings.malId
      },
      episodes: [],
      created: Date.now()
    }
  }
}
