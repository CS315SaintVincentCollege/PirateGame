"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
//#region Globals and imports
var fs = require('fs'), http = require('http');
var ws_1 = require("ws");
var path = require('path');
var WebSocketPort = 3002;
var WebServerPort = 3001;
//#endregion
//#region Web Socket Setttings
var wss = new ws_1.WebSocketServer({ port: WebSocketPort });
wss.on('connection', function connection(ws) {
    ws.on('message', function message(data) {
        console.log('received: %s', data);
    });
    ws.send(JSON.stringify({ type: "Debug", Data: "We Read you Loud and clear" }));
});
//#endregion
//#region Express Server Settup
http.createServer(function (req, res) {
    if (req.url == '/') {
        fs.readFile(__dirname + '/../client/' + 'index.html', function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
    else {
        fs.readFile(__dirname + '/../client/' + req.url, function (err, data) {
            if (err) {
                res.writeHead(404);
                res.end(JSON.stringify(err));
                return;
            }
            res.writeHead(200);
            res.end(data);
        });
    }
}).listen(WebServerPort);
console.log("WemServer @ http://localhost:" + WebServerPort + " and sockets are on port " + WebSocketPort);
//#endregion
