export default class TorrentProvider {
  constructor() {
    if (new.target === TorrentProvider) {
      throw new TypeError('Cannot construct Abstract instances directly');
    }
  }

  get name() {
    throw Error('The provider name cannot be null');
  }

  recentReleases(page) {
    return Promise.reject('The provider recent releases needs an implementation')
  }

  search(query, page) {
    return Promise.reject('The provider search needs an implementation')
  }
}
