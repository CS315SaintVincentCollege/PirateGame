//#region Globals and imports
var fs = require('fs'),
    http = require('http');
import { WebSocketServer } from 'ws';
import { createServer, IncomingMessage, ServerResponse } from 'http';
const path =  require('path');

import {Board} from './game';

let WebSocketPort = 3002;
let WebServerPort = 3001;
//#endregion

//#region Web Socket Setttings
const wss = new WebSocketServer({ port: WebSocketPort });

wss.on('connection', function connection(ws) {
  let game = new Board();

  ws.on('message', function message(data) {
    console.log('received: %s', data);
  });
  
  ws.send(JSON.stringify({type:"Debug", Data: "We Read you Loud and clear"}));
  ws.send(JSON.stringify({type: "BoardState", Data: game.SerializeBoard()}));
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