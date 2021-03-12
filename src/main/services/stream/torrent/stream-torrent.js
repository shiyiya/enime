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

const ERROR_MISSING_PARAMETER = {
  success: false,
  message: "The parameter count does not match what the server needs"
}

const ERROR_NO_METADATA = {
  success: false,
  message: "The metadata is missing, cannot read the files"
}

const linkToFileMap = {};

export function start() {
  const server = http.createServer();
  server.on('request', (req, res) => {
    let url = new URL(req.url, `http://localhost:${SERVER_PORT}`);

    const parameters = url.pathname.split('/');

    if (parameters.length < 3) return res.end(JSON.stringify(ERROR_MISSING_PARAMETER));

    const option = parameters[1].toLowerCase();

    if (option === 'metadata') {
      const torrentURL = decodeURIComponent(parameters.slice(2, parameters.length).join('/'))
      readTorrent(torrentURL, {}, (error, torrent) => {
        if (error) return res.end(JSON.stringify(ERROR_MAGNET_PARSE));

        const { name, infoHash, files, announce } = torrent;

        linkToFileMap[torrentURL] = {
          name,
          infoHash,
          files,
          announce
        };

        return res.end(JSON.stringify(linkToFileMap[torrentURL]));
      });
    } else if (option === 'read') {
      const torrentURL = decodeURIComponent(parameters.slice(3, parameters.length).join('/'))

      if (!linkToFileMap[torrentURL]) {
        return res.end(JSON.stringify(ERROR_NO_METADATA));
      } else {
        let metadata = linkToFileMap[torrentURL], index = Number.parseInt(parameters[2]);

        if (index > metadata.files.length - 1) index = 0;

        if (metadata.files[index].data) return fileToStream(req, res, metadata.files[index].data);

        let engine = torrentStream(metadata.infoHash, {
          tracker: true,
          trackers: metadata.announce,
          udp: true
        });

        engine.on('error', error => {
          console.log('error', error)
        })

        engine.ready(() => {
          const file = engine.files[index];

          metadata.files[index] = {
            ...metadata.files[index],
            data: file
          }

          fileToStream(req, res, file);
        })

        engine.on('uninterested', () => {
          engine.swarm.pause()
        })

        engine.on('interested', () => {
          engine.swarm.resume()
        })

        engine.listen()
      }
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
