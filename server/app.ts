console.clear();

//#region Globals and imports
var fs = require('fs'),
    http = require('http');
import { WebSocketServer } from 'ws';
import { createServer, IncomingMessage, ServerResponse } from 'http';
const path =  require('path');

import {Board, MakeMove, playerUseLight} from './game';

let WebSocketPort = 3002;
let WebServerPort = 3001;
//#endregion

//#region Web Socket Setttings
const wss = new WebSocketServer({ port: WebSocketPort });

let playerCount = 0;

let game = new Board(); //master board should not be sent to client
wss.on('connection', function connection(ws) {
  let playerID: Number = -1;


  
  let p1Board = game.obscureBoard(1);
  let p2Board = game.obscureBoard(2);

  ws.on('message', function message(data) {
    // if data.messagetype = movemessage
    // MakeMove with board
    //console.log(JSON.parse(data.toString()));


    let parsedMessageData = JSON.parse(data.toString());

    console.log(parsedMessageData);


    switch (parsedMessageData.messageType) {
      case "move":
        if (playerID == 1) {
          // is just player 1
          p1Board = MakeMove(parsedMessageData.position, game, p1Board, 1);
          ws.send(JSON.stringify({type: "BoardState", Data: p1Board}));
        } else if (playerID == 2) {
          // is just player 2
          p2Board = MakeMove(parsedMessageData.position, game, p2Board, 2);
          ws.send(JSON.stringify({type: "BoardState", Data: p2Board}));
        } else {
          // is unknown player
          playerID = -1; 
        }
      break;
      case "light":
        if (playerID == 1) {
          // is just player 1
          p1Board = playerUseLight(parsedMessageData.Direction, game, p1Board, 1);
          ws.send(JSON.stringify({type: "BoardState", Data: p1Board}));
        } else if (playerID == 2) {
          // is just player 2
          p2Board = playerUseLight(parsedMessageData.Direction, game, p2Board, 2);
          ws.send(JSON.stringify({type: "BoardState", Data: p2Board}));
        } else {
          // is unknown player
          playerID = -1; 
        }
    }
  });

  console.log('player connecting')
  if (playerCount == 0) {
    // send to just player 1
    console.log("player 1 connected");
    playerID = 1;
    playerCount++;
    ws.send(JSON.stringify({type: "BoardState", Data: p1Board}));
  } else if (playerCount == 1) {
    // send to just player 2
    console.log("player 2 connected");
    playerID = 2;
    playerCount++;
    ws.send(JSON.stringify({type: "BoardState", Data: p2Board}));
    wss.clients.forEach((client)=> {
      client.send(JSON.stringify({type: "Notify", Data: "Game can Begin"}))
    });
  }

  ws.send(JSON.stringify({type: "PlayerAssignment", Data: playerID}));

});
//#endregion


//#region Express Server Settup
http.createServer(function (req: IncomingMessage, res: ServerResponse) {
  if (req.url == '/') {
    fs.readFile(__dirname + '/../client/' + 'index.html', function (err: any, data:any) {
      if (err) {
        res.writeHead(404);
        res.end(JSON.stringify(err));
        return;
      }
      res.writeHead(200);
      res.end(data);
    })
  } else {
    fs.readFile(__dirname + '/../client/' + req.url, function (err: any, data:any) {
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
console.log(`WebServer @ http://localhost:${WebServerPort} and sockets are on port ${WebSocketPort}`);
//#endregion
