import rangeParser from 'range-parser';
import pump from 'pump';
import mime from 'mime';
import http from 'http';

const BASE_URL = "http://localhost";

export function start(file) {
    const server = http.createServer();

    server.on("request", (request, response) => {
        const url = new URL(request.url, BASE_URL);

        if (request.method === "OPTIONS" && request.headers["access-control-request-headers"]) {
            response.setHeader("Access-Control-Allow-Origin", request.headers.origin);
            response.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
            response.setHeader("Access-Control-Allow-Headers", request.headers["access-control-request-headers"]);
            response.setHeader("Access-Control-Max-Age", "1728000");

            return response.end();
        }

        if (request.headers.origin) response.setHeader('Access-Control-Allow-Origin', request.headers.origin);

        if (url.pathname === "/favicon.ico") {
            response.statusCode = 404;
            return response.end();
        }

        let rangeRaw = request.headers.range, range = rangeRaw && rangeParser(file.length, rangeRaw)[0];

        response.setHeader('Accept-Ranges', 'bytes')
        response.setHeader('Content-Type', mime.getType(file.name))
        response.setHeader('transferMode.dlna.org', 'Streaming')
        response.setHeader('contentFeatures.dlna.org', 'DLNA.ORG_OP=01;DLNA.ORG_CI=0;DLNA.ORG_FLAGS=01700000000000000000000000000000')

        if (!range) {
            response.setHeader('Content-Length', file.length)
            if (request.method === 'HEAD') return response.end()

            pump(file.createReadStream(), response);
            return
        }

        response.statusCode = 206
        response.setHeader('Content-Length', range.end - range.start + 1)
        response.setHeader('Content-Range', 'bytes ' + range.start + '-' + range.end + '/' + file.length)
        if (request.method === 'HEAD') return response.end();

        pump(file.createReadStream(range), response);
    });

    server.on("connection", (socket) => {
        socket.setTimeout(36000000);
    });

    return server;
}