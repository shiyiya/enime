import torrentStream from 'torrent-stream';
import { start as startServing } from './server';

export default class TorrentStream {
    #engine;

    start(magnet: string) {
        this.#engine = torrentStream(magnet);

        this.#engine.on("ready", () => {
            const file = this.#engine.files[0];

            const server = startServing(file);
            server.listen(10000);
        });

        this.#engine.on("uninterested", () => {
            this.#engine.swarm.pause();
        });

        this.#engine.on("interested", () => {
            this.#engine.swarm.resume();
        });

        this.#engine.listen();
    }

    shutdown() {
        if (this.#engine) this.#engine.destroy();
    }
}