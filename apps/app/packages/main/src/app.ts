import TorrentStream from './service/stream';

export default class Application {
    #torrentStreamEngine;

    start() {
        const magnet: string = "magnet:?xt=urn:btih:168dbbe80819d2c7de922a65a17af8327b96c73c&dn=%5BGJM-Kaleido%5D%20Spy%20x%20Family%20-%2002%20%28WEB%201080p%29%20%5B55DFB8DC%5D.mkv&tr=http%3A%2F%2Fnyaa.tracker.wf%3A7777%2Fannounce&tr=udp%3A%2F%2Fopen.stealth.si%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337%2Fannounce&tr=udp%3A%2F%2Fexodus.desync.com%3A6969%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce";

        this.#torrentStreamEngine = new TorrentStream();
        this.#torrentStreamEngine.start(magnet);
    }

    stop() {
        if (this.#torrentStreamEngine) this.#torrentStreamEngine.stop();
    }
}