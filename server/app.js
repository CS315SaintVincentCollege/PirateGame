"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
console.clear();
//#region Globals and imports
var fs = require('fs'), http = require('http');
var ws_1 = require("ws");
var path = require('path');
var game_1 = require("./game");
var WebSocketPort = 3002;
var WebServerPort = 3001;
//#endregion
//#region Web Socket Setttings
var wss = new ws_1.WebSocketServer({ port: WebSocketPort });
var playerCount = 0;
wss.on('connection', function connection(ws) {
    var playerID = -1;
    var game = new game_1.Board(); //master board should not be sent to client
    var p1Board = game.obscureBoard(1);
    var p2Board = game.obscureBoard(2);
    ws.on('message', function message(data) {
        // if data.messagetype = movemessage
        // MakeMove with board
        console.log(JSON.parse(data.toString()));
        if (playerCount == 0) {
            // send to just player 1
        }
        else if (playerCount == 1) {
            // send to just player 2
        }
        else if (playerCount != 0 && playerCount != 1) {
            // send to unknown player
            playerID = -1;
        }
    });
    console.log('player connecting');
    if (playerCount == 0) {
        // send to just player 1
        console.log("player 1 connected");
        playerID = 1;
        playerCount++;
        ws.send(JSON.stringify({ type: "BoardState", Data: p1Board }));
    }
    else if (playerCount == 1) {
        // send to just player 2
        console.log("player 2 connected");
        playerID = 2;
        playerCount++;
        ws.send(JSON.stringify({ type: "BoardState", Data: p2Board }));
    }
    ws.send(JSON.stringify({ type: "PlayerAssignment", Data: playerID }));
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
console.log("WebServer @ http://localhost:" + WebServerPort + " and sockets are on port " + WebSocketPort);
//#endregion
