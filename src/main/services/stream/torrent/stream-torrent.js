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

const linkToFileMap = {};

export function start() {
  const server = http.createServer();
  server.on('request', (req, res) => {
    let url = req.url.substring(1, req.url.length);
    if (!linkToFileMap[url]) {
      readTorrent(url, {}, (error, torrent) => {
        if (error) return res.error(ERROR_MAGNET_PARSE);

        let engine = torrentStream(`magnet:?xt=urn:btih:` + torrent.infoHash, {
          tracker: true,
          trackers: torrent.announce,
          udp: true
        });

        engine.on('error', error => {
          console.log('error', error)
        })

        engine.ready(() => {
          const file = engine.files[0];
          fileToStream(req, res, file);
          linkToFileMap[url] = file;
        })

        engine.on('uninterested', () => {
          engine.swarm.pause()
        })

        engine.on('interested', () => {
          engine.swarm.resume()
        })

        engine.listen()
      });
    } else {
      fileToStream(req, res, linkToFileMap[url]);
    }
  });

  server.listen(SERVER_PORT)
}

function fileToStream(request, response, file) {
  let range = request.headers.range;
  range = range && rangeParser(file.length, range)[0];

  response.setHeader('Accept-Ranges', 'bytes');
  response.setHeader('Content-Type', mime.getType(file.name));
  response.setHeader('transferMode.dlna.org', 'Streaming');
  response.setHeader('contentFeatures.dlna.org', 'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000');

  if (!range) {
    response.setHeader('Content-Length', file.length);
    if (request.method === 'HEAD') return res.end();

    file
      .createReadStream()
      .pipe(response);
    return;
  }

  response.statusCode = 206;
  response.setHeader('Content-Length', range.end - range.start + 1);
  response.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.length);
  if (request.method === 'HEAD') return response.end();

  file
    .createReadStream(range)
    .pipe(response);
}
