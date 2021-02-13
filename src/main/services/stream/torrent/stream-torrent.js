import readTorrent from 'read-torrent'
import torrentStream from 'enime-torrent-stream'
import rangeParser from 'range-parser'
import mime from 'mime'
import http from "http"

const SERVER_PORT = 8888;

const ERROR_MAGNET_PARSE = {
  success: false,
  message: "Error occurred while attempting to parse the torrent to magnet link"
}

export default (torrentLink) => {
  return new Promise((resolve, reject) => {
    readTorrent(torrentLink, {}, (error, torrent) => {
      if (error) reject(ERROR_MAGNET_PARSE);

      let engine = torrentStream(`magnet:?xt=urn:btih:` + torrent.infoHash, {
        tracker: true,
        trackers: torrent.announce,
        udp: true
      });

      engine.on('error', error => {
        console.log('error', error)
      })

      engine.ready(() => {
        console.log('ready')
        const file = engine.files[0];

        const server = http.createServer();
        server.on('request', (req, res) => {
          let range = req.headers.range;
          range = range && rangeParser(file.length, range)[0];

          res.setHeader('Accept-Ranges', 'bytes');
          res.setHeader('Content-Type', mime.getType(file.name));
          res.setHeader('transferMode.dlna.org', 'Streaming');
          res.setHeader('contentFeatures.dlna.org', 'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000');

          if (!range) {
            res.setHeader('Content-Length', file.length);
            if (req.method === 'HEAD') return res.end();

            file
              .createReadStream()
              .pipe(res);
            return;
          }

          res.statusCode = 206;
          res.setHeader('Content-Length', range.end - range.start + 1);
          res.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.length);
          if (req.method === 'HEAD') return res.end();

          file
            .createReadStream(range)
            .pipe(res);
        });

        server.listen(SERVER_PORT, () => {
          resolve({
            success: true,
            port: SERVER_PORT,
            file: file.name
          })
        })
      })

      engine.on('uninterested', () => {
        engine.swarm.pause()
      })

      engine.on('interested', () => {
        engine.swarm.resume()
      })

      engine.listen()
    });
  });
}
